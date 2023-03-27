<?php

namespace EmbedPress\Includes\Classes;
use EmbedPress\Shortcode;

if ( !defined('ABSPATH') ) {
	exit;
} // Exit if accessed directly

class Helper {

	/**
	 * Parse a query string into an associative array.
	 *
	 * If multiple values are found for the same key, the value of that key
	 * value pair will become an array. This function does not parse nested
	 * PHP style arrays into an associative array (e.g., foo[a]=1&foo[b]=2 will
	 * be parsed into ['foo[a]' => '1', 'foo[b]' => '2']).
	 *
	 * @param string   $str         Query string to parse
	 * @param int|bool $urlEncoding How the query string is encoded
	 *
	 * @return array
	 */
	public static function parse_query($str, $urlEncoding = true)
	{
		$result = [];

		if ($str === '') {
			return $result;
		}

		if ($urlEncoding === true) {
			$decoder = function ($value) {
				return rawurldecode(str_replace('+', ' ', $value));
			};
		} elseif ($urlEncoding === PHP_QUERY_RFC3986) {
			$decoder = 'rawurldecode';
		} elseif ($urlEncoding === PHP_QUERY_RFC1738) {
			$decoder = 'urldecode';
		} else {
			$decoder = function ($str) { return $str; };
		}

		foreach (explode('&', $str) as $kvp) {
			$parts = explode('=', $kvp, 2);
			$key = $decoder($parts[0]);
			$value = isset($parts[1]) ? $decoder($parts[1]) : null;
			if (!isset($result[$key])) {
				$result[$key] = $value;
			} else {
				if (!is_array($result[$key])) {
					$result[$key] = [$result[$key]];
				}
				$result[$key][] = $value;
			}
		}

		return $result;
	}
	public static function get_pdf_renderer() {
		$renderer = EMBEDPRESS_URL_ASSETS . 'pdf/web/viewer.html';
		// @TODO; apply settings query args here
		return $renderer;
	}

	public static  function get_extension_from_file_url($url) {
		$urlSplit = explode(".", $url);
		$ext = end($urlSplit);
		return $ext;
		
	}
	
	public static function is_file_url($url) {
		$pattern = '/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/i';
		return preg_match($pattern, $url) === 1;
	}

	public static function is_opensea($url) {
		return strpos($url, "opensea.io") !== false;
	}
	public static function is_youtube_channel($url) {
		return (bool) (preg_match('~(?:https?:\/\/)?(?:www\.)?(?:youtube.com\/)(?:channel\/|c\/|user\/|@)(\w+)~i', (string) $url));
	}

	public static function is_youtube($url) {
		return (bool) (preg_match('~(?:https?://)?(?:www\.)?(?:youtube\.com|youtu\.be)/watch\?v=([^&]+)~i', (string) $url));
	}

	// Saved sources data temporary in wp_options table
	public static function get_source_data($blockid, $source_url, $source_option_name, $source_temp_option_name) {
		
		
		if(self::is_youtube_channel($source_url)){
			$source_name = 'YoutubeChannel'; 
		}
		else if(self::is_youtube($source_url)){
			$source_name = 'Youtube'; 
		}
		else if (!empty(self::is_file_url($source_url))) {
			$source_name = 'document_' . self::get_extension_from_file_url($source_url);
		}
		else if(self::is_opensea($source_url)){
			$source_name  = 'OpenSea';
		}
		else{
			Shortcode::get_embera_instance();
			$collectios = Shortcode::get_collection();
			$provider = $collectios->findProviders($source_url);
			if(!empty($provider[$source_url])){
				$source_name = $provider[$source_url]->getProviderName();
			}
			else{
				$source_name = 'Unknown Source';
			}
		}
		
		if(!empty($blockid) && $blockid != 'undefined'){
			$sources = json_decode(get_option($source_temp_option_name), true);

			if(!$sources) {
				$sources = array();
			}
			$exists = false;
			
			foreach($sources as $i => $source) {
				if ($source['id'] === $blockid) {
					$sources[$i]['source']['name'] = $source_name;
					$sources[$i]['source']['url'] = $source_url;
					$exists = true;
					break;
				}
			}

			if(!$exists) {
				$sources[] = array('id' => $blockid, 'source' => array('name' => $source_name, 'url' => $source_url, 'count' => 1));
			}
			
			update_option($source_temp_option_name, json_encode($sources));
		}
	}

	// Saved source data when post updated
	public static function get_save_source_data_on_post_update( $source_option_name, $source_temp_option_name ) {

		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		} 
		$temp_data = json_decode(get_option($source_temp_option_name), true);
		$source_data = json_decode(get_option($source_option_name), true);
		if(!$temp_data) {
			$temp_data = array();
		}
		if(!$source_data) {
			$source_data = array();
		}

		$sources = array_merge($temp_data, $source_data);

		$unique_sources = array();
		foreach ($sources as $source) {
			$unique_sources[$source['id']] = $source;
		}
		
		$unique_sources = array_values($unique_sources);

		delete_option($source_temp_option_name);

		update_option($source_option_name, json_encode($unique_sources));
	}
	
	//Delete source data from option table when widget is removed
	public static function get_delete_source_data($blockid, $source_option_name, $source_temp_option_name) {
		if (!empty($blockid) && $blockid != 'undefined') {
			$sources = json_decode(get_option($source_option_name), true);			
			$temp_sources = json_decode(get_option($source_temp_option_name), true);	
			if ($sources) {
				foreach ($sources as $i => $source) {
					if ($source['id'] === $blockid) {
						unset($sources[$i]);
						break;
					}
				}
				update_option($source_option_name, json_encode(array_values($sources)));
			}
			if ($temp_sources) {
				foreach ($temp_sources as $i => $source) {
					if ($source['id'] === $blockid) {
						unset($temp_sources[$i]);
						break;
					}
				}
				update_option($source_temp_option_name, json_encode(array_values($temp_sources)));
			}
		}
		wp_die();
	}
	
	//Delete source temporary data when reload without update or publish
	public static function get_delete_source_temp_data_on_reload($source_temp_option_name) {
		$source_temp_data = json_decode(get_option($source_temp_option_name), true);
		if ($source_temp_data ) {
			delete_option( $source_temp_option_name );
		}
	}

	public static function get_file_title($url){
		return get_the_title(attachment_url_to_postid( $url ));
	}
}
