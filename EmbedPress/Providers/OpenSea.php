<?php

/**
 * opensea.io
 *
 * @package EmbedPress
 * @author Alimuzzaman Alim <alimuzzamanalim@gmail.com>
 * @link   https://alim.dev/
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace EmbedPress\Providers;

use Embera\Provider\ProviderAdapter;
use Embera\Provider\ProviderInterface;
use Embera\Url;

/**
 * opensea.io Provider
 * @link opensea.io
 */
class OpenSea extends ProviderAdapter implements ProviderInterface {
	/** inline {@inheritdoc} */
	protected $shouldSendRequest = false;
    public static $curltimeout = 30;
    /** inline {@inheritdoc} */
    /** @var array Array with allowed params for the current Provider */
    protected $allowedParams = [
        'maxwidth',
        'maxheight',
        'limit',
        'orderby',
        'limit',
        'orderby',
        'nftperrow',
        'gapbetweenitem',
        'nftimage',
        'nftcreator',
        'prefix_nftcreator',
        'nfttitle',
        'nftprice',
        'prefix_nftprice',
        'nftlastsale',
        'prefix_nftlastsale',
        'nftbutton',
        'label_nftbutton',
        'titleColor',
		'titleFontsize',
		'creatorColor',
		'creatorFontsize',
		'creatorLinkColor',
		'creatorLinkFontsize',
		'priceColor',
		'priceFontsize',
		'lastSaleColor',
		'lastSaleFontsize',
		'buttonTextColor',
		'buttonBackgroundColor',
        'buttonFontSize'
    ];

    /** inline {@inheritdoc} */
    protected static $hosts = [
        'opensea.io',
    ];

    /** inline {@inheritdoc} */
    protected $httpsSupport = true;

    public function getAllowedParams(){
        return $this->allowedParams;
    }

    /** inline {@inheritdoc} */
    public function validateUrl(Url $url) {
        return (bool) (preg_match('~opensea\.io/(collection/(.*)|assets/.*[a-zA-Z0-9]+/[a-zA-Z0-9]+)~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function normalizeUrl(Url $url) {
        return $url;
    }

    /** inline {@inheritdoc} */
    public function isAssets($url) {
        return (bool) (preg_match('~opensea\.io/assets/.*[a-zA-Z0-9]+/[a-zA-Z0-9]+~i', (string) $url));
    }

    /** inline {@inheritdoc} */
    public function isCollection($url) {
        return (bool) (preg_match('~opensea\.io/collection/(.*)~i', (string) $url));
    }

    protected static function get_api_key() {
        $settings = (array) get_option(EMBEDPRESS_PLG_NAME . ':opensea', []);
        return !empty($settings['api_key']) ? $settings['api_key'] : '';
    }


	public function getStaticResponse() {
        $results = [
            "title"         => "",
            "type"          => "video",
            'provider_name' => $this->getProviderName(),
            "provider_url"  => "https://opensea.io/",
            'html'          => "",
        ];
        $url = $this->getUrl();

        if($this->isAssets($url)){
            $results['html'] = $this->getAssets($url);
        }
        else if($this->isCollection($url)){
            $results['html'] = $this->getCollection($url);
        }

        return $results;
    }


    public function getAssets($url) {
        preg_match('~opensea\.io/assets/.*/([a-zA-Z0-9]+)/([a-zA-Z0-9]+)~i', (string) $url, $matches);

        if(!empty($matches[1]) && !empty($matches[2])){
            $params = $this->getParams();
            return "
            <!-- vertical=\"true\" -->
            <nft-card
            width=\"{$params['maxwidth']}\"
            contractAddress=\"{$matches[1]}\"
            tokenId=\"{$matches[2]}\">
            </nft-card>
            <script src=\"https://unpkg.com/embeddable-nfts/dist/nft-card.min.js\"></script>";
        }
        return "";
    }

    /**
     * Get Opensea Collection assets data
     */
    public function getCollection($url) {
        preg_match('~opensea\.io/collection/(.*)~i', (string) $url, $matches);

        $opensea_settings = get_option( EMBEDPRESS_PLG_NAME.':opensea');

        $api_key = 'b61c8a54123d4dcb9acc1b9c26a01cd1';
        $orderby = 'desc';
        $limit = 20;

        if(!empty($opensea_settings['api_key'])){
            $api_key = $opensea_settings['api_key'];
        }
        if(!empty($opensea_settings['orderby'])){
            $orderby = $opensea_settings['orderby'];
        }
        if(!empty($opensea_settings['limit'])){
            $limit = $opensea_settings['limit'];
        }


        if(!empty($matches[1])){
            $html = "";
            $params = $this->getParams();
            $param = array(
                'limit' => $params['limit']?$params['limit']:$limit,
                'order_direction' => $params['orderby']?$params['orderby']:$orderby,
                'collection_slug' => $matches[1],
                'include_orders' => true,
            );
            $url = "https://api.opensea.io/api/v1/assets?" . http_build_query($param);

            $results = wp_remote_get($url, [
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $api_key,
                )
            ]);
            if (!is_wp_error($results) ) {
                $jsonResult = json_decode($results['body']);
                // wp_send_json($jsonResult);

                $html = print_r($jsonResult, true);
            }

            ob_start();
            ?>

                <div class="ep-parent-wrapper ep-parent-ep-nft-gallery-r1a5mbx ">
                    <div class="ep-nft-gallery-wrapper ep-nft-gallery-r1a5mbx" data-id="ep-nft-gallery-r1a5mbx">
                        <div class="ep_nft_content_wrap ep_nft_grid nft_items preset-1">
                            <?php
                                if(is_array($jsonResult->assets)){
                                    foreach ($jsonResult->assets as $key => $asset) {
                                        $asset = $this->normalizeJSONData($asset);
                                        $template = $this->nftItemTemplate($asset);
                                        print_r($template);
                                    }
                                }
                            ?>
                        </div>
                    </div>
                </div>

                <?php $this->openSeaStyle($this->getParams()); ?>

            <?php $html = ob_get_clean();

            // wp_send_json($html);

            return $html;
        }
        return "";
    }

    /**
     * Normalize json data
     */
    public function normalizeJSONData($asset){
        $nftItem = [];
        $nftItem['id'] = $asset->id;
        $nftItem['name'] = $asset->name;
        $nftItem['permalink'] = $asset->permalink;
        $nftItem['description'] = $asset->description;
        $nftItem['image_url'] = $asset->image_url;
        $nftItem['image_thumbnail_url'] = $asset->image_thumbnail_url;
        $nftItem['image_preview_url'] = $asset->image_preview_url;
        $nftItem['image_original_url'] = $asset->image_original_url;
        $nftItem['created_by'] = $asset->creator->user->username;
        $nftItem['creator_img_url'] = $asset->asset_contract->image_url;
        $nftItem['current_price'] = $asset->seaport_sell_orders?$asset->seaport_sell_orders:0;
        $nftItem['last_sale'] = $asset->last_sale->total_price?$asset->last_sale->total_price:0;
        $nftItem['creator_url'] = 'https://opensea.io/'.$nftItem['created_by'];

        return $nftItem;
    }

    //Get colors from Gutenberg
    public function getColor($datakey){
        $params = $this->getParams();
        $color = '';
        if(!empty($params[$datakey])){
            $color = $params[$datakey];
        }
        return $color;
    }

    //Get fontsize from Gutenberg
    public function getFontsize($datakey){
        $params = $this->getParams();
        $fontsize = '';
        if(!empty($params[$datakey])){
            $fontsize = $params[$datakey];
        }
        return $fontsize;
    }

    // create style for Gutenberg
    public function createStye($colorKey, $fontsizeKey){ 
        $color = $this->getColor($colorKey);
        $fontsize = $this->getFontsize($fontsizeKey);
        $itemStyle = '';
        $buttonBg = '';
        // if(!empty($this->getColor('buttonBackgroundColor'))){
        //     $buttonBg = 'background-color: '.$this->getColor('buttonBackgroundColor');
        // }
        if(!empty($color) && !empty($fontsize) && ($fontsize != 'true' && $color != 'ture')){
            $itemStyle = $itemStyle . "style='color:{$color}; font-size:{$fontsize}px; {$buttonBg}'";
        }
        else if(!empty($color) && ($color != 'true')){
            $itemStyle = $itemStyle ."style=color:{$color};{$buttonBg}";
        }
        else if(!empty($fontsize) && ($fontsize != 'true')){
            $itemStyle = $itemStyle ."style=font-size:{$fontsize}px;{$buttonBg}";
        }

        return $itemStyle; 
    }

    /**
     * NFT Collection Item template
     */
     public function nftItemTemplate($item){

        $params = $this->getParams();
        
        $params = wp_parse_args( $params, [
            'nftimage' => true,
            'nfttitle' => true,
            'nftcreator' => true,
            'nftbutton' => true,
            'nftprice' => true,
            'nftlastsale' => true
        ] );

        //Intialize default value
        $thumbnail = '';
        $title = '';
        $creator = '';
        $prefix_creator = 'Created By';
        $current_price = 0;
        $prefix_current_price = 'Price';
        $last_sale = 0;
        $prefix_last_sale = 'Last Sale';
        $nftbutton = '';
        $label_nftbutton = 'Sea Details';

        $current_price_template = '';
        $last_sale_price_template = ''; 

        // Assgined current value
        $name = $item['name'] ? $item['name'] : '#'.$item['id'];
        $image_url = $item['image_url'] ? $item['image_url'] : ($item['image_thumbnail_url']?$item['image_thumbnail_url'] : ($item['image_preview_url']?$item['image_preview_url'] : $item['image_original_url']));
        $created_by = $item['created_by'];
        $creator_img_url = $item['creator_img_url'];
        
        $current_price = $item['current_price']?(float)($item['current_price'][0]->current_price / 1000000000000000000) : 0;

        if(!empty($item['last_sale'] && $item['last_sale'] > 0) ){
            $last_sale = (float) $item['last_sale'] / 1000000000000000000;
        }

        // Checked and assigned prefix text value 
        if(!empty($params['prefix_nftcreator'])){
            $prefix_creator = $params['prefix_nftcreator'];
        }
        if(!empty($params['prefix_nftprice'])){
            $prefix_current_price = $params['prefix_nftprice'];
        }
        if(!empty($params['prefix_nftlastsale'])){
            $prefix_last_sale = $params['prefix_nftlastsale'];
        }
        if(!empty($params['label_nftbutton'])){
            $label_nftbutton = $params['label_nftbutton'];
        }

        $eth_icon = '
            <svg width="1535" height="2500" viewBox="0 0 256 417"
            xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                <path fill="#343434"
                    d="m127.961 0-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"></path>
                <path fill="#8C8C8C" d="M127.962 0 0 212.32l127.962 75.639V154.158z"></path>
                <path fill="#3C3C3B"
                    d="m127.961 312.187-1.575 1.92v98.199l1.575 4.6L256 236.587z"></path>
                <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"></path>
                <path fill="#141414" d="m127.961 287.958 127.96-75.637-127.96-58.162z"></path>
                <path fill="#393939" d="m0 212.32 127.96 75.638v-133.8z"></path>
            </svg>
            ';


        if(!empty($current_price) &&  (($current_price > 0) && (($params['nftprice'] == 'yes') || ($params['nftprice'] == 'true')))){
            $current_price_template = '
            <div class="ep_nft_price ep_current_price" '.$this->createStye('priceColor', 'priceFontsize').'>
                <span class="eb_nft_label">'.esc_html($prefix_current_price).'</span>
                <span  class="eb_nft_currency">'.$eth_icon.'</span>
                <span class="eb_nft_price">'. esc_html(round($current_price, 4)).'</span>
            </div>
            ';
        }

        if(!empty($last_sale) && (($last_sale > 0) && (($params['nftlastsale'] == 'yes') || ($params['nftlastsale'] == 'true')))){
            $last_sale_price_template = '
            <div class="ep_nft_price ep_nft_last_sale" '.$this->createStye('lastSaleColor', 'lastSaleFontsize').'>
                <span class="eb_nft_label">'.esc_html($prefix_last_sale).'</span>
                <span  class="eb_nft_currency">'.$eth_icon.'</span>
                <span class="eb_nft_price">'. esc_html(round($last_sale, 4)).'</span>
            </div>
            ';
        }


        if(($params['nftimage'] == 'yes') || ($params['nftimage'] == 'true')):
            $thumbnail = '<div class="ep_nft_thumbnail"><img
            src="'.esc_url($image_url).'"
            alt="'.esc_attr($name).'"></div>';
        endif;

        if(($params['nftcreator'] == 'yes') || ($params['nftcreator'] == 'true')):
            $creator = '<div class="ep_nft_owner_wrapper">
                <div class="ep_nft_creator"><img
                        src="'.esc_url($creator_img_url).'"
                        alt="'.esc_attr($created_by).'"><span  '.$this->createStye('creatorColor', 'creatorFontsize').'>'.esc_html($prefix_creator).' <a target="_blank"
                            href="'.esc_url($item['creator_url']).'" '.$this->createStye('creatorLinkColor', 'creatorLinkFontsize').'>'.esc_html($created_by).'</a></span>
                </div>
            </div>';
        endif;

        if(($params['nfttitle'] == 'yes') || ($params['nfttitle'] == 'true')):
            $title = ' <h3 class="ep_nft_title" '.$this->createStye('titleColor', 'titleFontsize').'>'.esc_html($name).'</h3>';
        endif;

        if(($params['nftbutton'] == 'yes') || ($params['nftbutton'] == 'true')):
            $nftbutton = '<div class="ep_nft_button">
                <a target="_blank" href="'.esc_url($item['permalink']).'" '.$this->createStye('buttonTextColor', 'buttonFontSize').'>'.esc_html($label_nftbutton).'</a>
                </div>';
        endif;

        $template = '
                <div class="ep_nft_item">
                    '.$thumbnail.'
                    <div class="ep_nft_content">
                       '.$title.'
                        <div class="ep_nft_content_body">
                           '.$creator.'
                            <div class="ep_nft_price_wrapper">
                                '.$current_price_template.'
                                '.$last_sale_price_template.'
                            </div>
                        </div>
                        '.$nftbutton.'
                    </div>
                </div>
            ';

        return $template;
     }

    /** inline {@inheritdoc} */
    public function getFakeResponse() {
        return [
            'type' => 'video',
            'provider_name' => $this->getProviderName(),
            'provider_url' => 'https://opensea.io/',
            'title' => 'Unknown title',
            'html' => '',
        ];
    }

    public function openSeaStyle($params){

            if($params['nftperrow'] > 0){
                $nftperrow = 'calc('.(100 / $params['nftperrow']).'% - '.$params['gapbetweenitem'].'px)';
            }
            else{
                $nftperrow = 'auto';
            }

            $uniqid = '.ose-uid-'.md5($this->getUrl());
        ?>

        <style>
            <?php echo esc_html($uniqid); ?> .ep_nft_content_wrap {
                grid-template-columns: repeat(auto-fit, minmax(<?php echo esc_html($nftperrow); ?>, 1fr))!important;
                gap: <?php echo esc_html($params['gapbetweenitem']); ?>px!important;
            }
        </style>
    <?php
    }

}
