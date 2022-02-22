<?php

namespace EmbedPress\Includes\Classes;

use \Elementor\Plugin;

class EmbedPress_Background_Process extends \WP_Background_Process {
    /**
	 * @var EmbedPress_Background_Process
	 */
	private static $instance = null;

	protected $action           = 'embedpress_process';
	protected $elementor_widget = [
        'embedpres_elementor',
        'embedpress_calendar',
        'embedpres_document',
        'embedpress_pdf',
    ];
    protected $post_types = [];
    protected $completed  = [];

    private $completed_db_key = '';
    public  $elementor_db_key = '';
    public  $gutenberg_db_key = '';


    public static function instance(){
        if( is_null( self::$instance ) ) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    public function __construct(){
        parent::__construct();
        $this->post_types = $this->get_post_types();
        $this->completed_db_key =  "{$this->action}_completed";
        $this->elementor_db_key =  "{$this->action}_elementor";
        $this->gutenberg_db_key =  "{$this->action}_gutenberg";

        add_action('save_post', [ $this, 'save_post' ], 10, 3 );
    }

    public function save_post($post_ID, $post, $update){
        if ( wp_doing_cron() || wp_is_post_revision( $post_ID ) || wp_is_post_autosave( $post_ID ) || in_array( $post_ID, $this->completed, true ) ){
            return;
        }

        if( ! (defined('REST_REQUEST') && REST_REQUEST) ) {
            return;
        }

        $this->set_to_queue( $post_ID );
        $this->save();
    }

    public function is_preview_mode(){
        if (isset($_REQUEST['elementor-preview'])) {
            return false;
        }

        return true;
    }

    private function get_post_types(){
        $post_types = array_filter(get_post_types( [ 'public' => true ] ), [ $this, 'filtered_types' ] );
        $this->post_types = array_keys($post_types);
        return $this->post_types;
    }

	/**
	 * Task
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over
	 *
	 * @return mixed
	 */
	protected function task( $item ) {
        $post = get_post( intval( $item ) );
        if( is_wp_error( $post ) || is_null( $post ) || ! $post instanceof \WP_Post ) {
            $this->set_complete( $item );
            return false;
        }
        // return false;
        /**
         * Elementor Widgets Count
         */
        $document = Plugin::$instance->documents->get( $item );
        if( $document->is_built_with_elementor() ) {
            $data = $document->get_elements_data();
            $this->elementor_widgets_count( $data, $item );
        } else {
            // Gutenberg Block Count
            $this->gutenberg_blocks_count( $post, $item );
        }

        $this->set_complete( $item );

		return false;
	}

    public function get_collections_count( $data, &$collections, $item_id = false ){
        $new_collections = $this->collect_elements_in_content( $data );

        if( $item_id ) {
            $old_collections = $collections;
            $collections = isset( $collections[ $item_id ] ) ? $collections[ $item_id ] : [];
        }

        array_walk($new_collections, function($value, $key) use (&$collections) {
            $collections[ $key ] = intval( $value );
        });

        if( $item_id ) {
            $old_collections[ $item_id ] = $collections;
            return $old_collections;
        }
        return $collections;
    }

    public function elementor_widgets_count( $data, $item_id ){
        $collections = $this->get_data($this->elementor_db_key, []);
        $collections = $this->get_collections_count($data, $collections, $item_id);
        $this->set_data($this->elementor_db_key, $collections);

        return $collections;
    }

    public function get_blocks_collections( $data, &$collections, $item_id = false ){
        preg_match_all('/(wp:embedpress\/([a-z-]+).*)\S/', $data, $matches);

        $old_collections = $collections;

        if( ! empty( $matches[2] ) ) {
            $new_collections = array_reduce($matches[2], function( $carry, $item ){
                $carry[ "wp:embedpress/$item" ] = isset( $carry[ "wp:embedpress/$item" ] ) ? $carry[ "wp:embedpress/$item" ] + 1 : 1;
                return $carry;
            }, [] );
        }

        if( ! empty( $new_collections ) ) {
            $old_collections[ $item_id ] = $new_collections;
            return $old_collections;
        }

        return $collections;
    }

    public function gutenberg_blocks_count( $post, $id ){
        $collections = $this->get_data($this->gutenberg_db_key, []);
        $collections = $this->get_blocks_collections($post->post_content, $collections, $id);
        $this->set_data($this->gutenberg_db_key, $collections);

        return $collections;
    }

    public function get_collections( $key ){
        if( empty( $key ) ) {
            return [];
        }
        $collections = $this->get_data($key, []);
        $new_collections = [];
        if( ! empty( $collections ) ) {
            array_walk_recursive($collections, function( $item, $key ) use( &$new_collections ) {
                $new_collections[ $key ] = isset( $new_collections[ $key ] ) ? $new_collections[ $key ] + $item : $item;
            });
        }

        return $new_collections;
    }

    public function collect_elements_in_content( $elements ) {
		$collections = [];

		foreach ( $elements as $element ) {
			// collect widget
			if ( isset( $element[ 'elType' ] ) && $element[ 'elType' ] == 'widget' ) {
				if ( $element[ 'widgetType' ] === 'global' ) {
					$document = Plugin::$instance->documents->get( $element[ 'templateID' ] );

					if ( is_object( $document ) ) {
                        $collections = $this->get_collections_count($document->get_elements_data(), $collections);
					}
				} else {
                    if( in_array( $element[ 'widgetType' ], $this->elementor_widget )) {
                        $collections[ $element[ 'widgetType' ] ] = isset( $collections[ $element[ 'widgetType' ] ] ) ? intval( $collections[ $element[ 'widgetType' ] ] ) + 1 : 1;
                    }
				}
			}

			if ( !empty( $element[ 'elements' ] ) ) {
                $collections = $this->get_collections_count( $element[ 'elements' ], $collections );
			}
		}
		return $collections;
	}

    public function filtered_types( $item ){
        return $item !== 'attachment';
    }

    public function set_to_queue( $id ){
        $this->completed[] = $id;
        $this->push_to_queue( $id );
    }

    public function queuing_start(){
        $ids = $this->get_ids();

        if( ! empty( $ids ) && is_array( $ids ) ) {
            array_walk( $ids, [ $this, 'set_to_queue' ]);
            $this->save();
        }
    }

    private function get_ids(){
        global $wpdb;
        $completed_ids = implode(',', $this->get_completed());

        $types = [];
        foreach( $this->post_types as $type ) {
            $types[] = "post_type = '%s'";
        }
        $types_query = implode( ' OR ', $types);

        $query = "SELECT ID from $wpdb->posts WHERE ( $types_query ) AND post_status = '%s'";
        if( ! empty( $completed_ids ) ) {
            $query .= " AND ID NOT IN ( $completed_ids )";
        }
        $query .= " LIMIT 0, 10";


        $prepared_query = $wpdb->prepare( $query, array_merge($this->post_types, [ 'publish' ]) );
        $results = $wpdb->get_col( $prepared_query );

        // if( defined('WP_DEBUG_LOG') && WP_DEBUG_LOG ) {
        //     error_log('self::get_ids()');
        // }

        return $results;
    }

    private function get_completed(){
        $_ids = $this->get_data( $this->completed_db_key, [] );
        if( empty( $_ids ) ) {
            $_ids = [];
        }
        $_ids = array_map('intval', $_ids);
        return $_ids;
    }

    private function set_complete( $id ){
        $_ids = $this->get_completed( $this->completed_db_key, [] );
        if( empty( $_ids ) ) {
            $_ids = [];
        }

        $id = intval( $id );

        if( ! in_array( $id, $_ids, true ) ) {
            $_ids[] = $id;
        }

        $this->set_data( $this->completed_db_key, $_ids );
    }

    private function set_data( $key, $value, $expire =  MONTH_IN_SECONDS){
        set_site_transient( $key, $value, $expire );
    }
    private function get_data( $key, $default ){
        $data = get_site_transient( $key );

        if( $data == false ) {
            return $default;
        }
        return $data;
    }

	/**
	 * Complete
	 *
	 * Override if applicable, but ensure that the below actions are
	 * performed, or, call parent::complete().
	 */
	protected function complete() {
		parent::complete();

		// Show notice to user or perform some other arbitrary task...
        $this->completed = [];
	}

    public function queue_empty(){
        return parent::is_queue_empty();
    }
}