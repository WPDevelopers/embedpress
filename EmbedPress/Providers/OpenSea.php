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
        'nfttitle',
        'nftprice',
        'nftlastsale',
        'nftbutton' ];

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
    

    public function getOsSettingsData($key){
       
        $opensea_settings = get_option( EMBEDPRESS_PLG_NAME.':opensea');
        
        if(isset($opensea_settings['api_key'])){
            $api_key = isset($opensea_settings['api_key'])?$opensea_settings['api_key']:'b61c8a54123d4dcb9acc1b9c26a01cd1';
        }
    }


    /**
     * Get Opensea Collection Data 
     */
    public function getCollection($url) {
        preg_match('~opensea\.io/collection/(.*)~i', (string) $url, $matches);
        

        if(!empty($matches[1])){
            $html = "";
            $params = $this->getParams();
            $param = array(
                'limit' => $params['limit'],
                'order_direction' => $params['orderby'],
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
                                        print_r($asset);
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
        $nftItem['current_price'] = $asset->seaport_sell_orders?$asset->seaport_sell_orders:'';
        $nftItem['last_sale'] = $asset->last_sale->total_price?$asset->last_sale->total_price:'';
        $nftItem['creator_url'] = 'https://opensea.io/'.$nftItem['created_by'];

        return $this->nftItemTemplate($nftItem);
    }

    /**
     * NFT Collection Item template
     */

     public function nftItemTemplate($item){

        $name = $item['name'] ? $item['name'] : '#'.$item['id'];
        $image_url = $item['image_url'] ? $item['image_url'] : ($item['image_thumbnail_url']?$item['image_thumbnail_url'] : ($item['image_preview_url']?$item['image_preview_url'] : $item['image_original_url']));
        $created_by = $item['created_by'];
        $creator_img_url = $item['creator_img_url'];
        $current_price = $item['current_price']?($item['current_price'][0]->current_price / 1000000000000000000) : '';
        $last_sale = '';
        
        if(!empty($item['last_sale']) ){
            $last_sale = $item['last_sale'] / 1000000000000000000;
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

        $current_price_template = '';
        if(!empty($current_price)){
            $current_price_template = '
            <div class="ep_nft_price ep_current_price">
                <span class="eb_nft_label">Price:</span>
                <span  class="eb_nft_currency">'.$eth_icon.'</span>
                <span class="eb_nft_price">'. esc_html(round($current_price, 4)).'</span>
            </div>
            ';
        }

        $last_sale_price_template = '';

        if(!empty($last_sale)){
            $last_sale_price_template = '
            <div class="ep_nft_price ep_nft_last_sale">
                <span class="eb_nft_label">Last Sale:</span>
                <span  class="eb_nft_currency">'.$eth_icon.'</span>
                <span class="eb_nft_price">'. esc_html(round($last_sale, 2)).'</span>
            </div>
            ';
        }
        

        $template = '
                <div class="ep_nft_item">
                    <div class="ep_nft_thumbnail"><img
                            src="'.esc_url($image_url).'"
                            alt="Dopamine"></div>
                    <div class="ep_nft_content">
                        <h3 class="ep_nft_title">'.esc_html($name).'</h3>
                        <div class="ep_nft_content_body">
                            <div class="ep_nft_owner_wrapper">
                                <div class="ep_nft_creator"><img
                                        src="'.esc_url($creator_img_url).'"
                                        alt="'.esc_attr($created_by).'"><span>Created by <a target="_blank"
                                            href="'.esc_url($item['creator_url']).'">'.esc_html($created_by).'</a></span>
                                </div>
                            </div>
                            
                            <div class="ep_nft_price_wrapper">
                                '.$current_price_template.'
                                '.$last_sale_price_template.'
                            </div>
                        </div>
                        <div class="ep_nft_button"><a target="_blank"
                                    href="'.esc_url($item['permalink']).'">See
                                    Details</a></div>
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
            <?php echo esc_html($uniqid); ?> .ep_nft_thumbnail{
                display: <?php echo (($params['nftimage'] == 'yes') || ($params['nftimage'] == 'true'))? 'inherit' : 'none'; ?>;
            }
            <?php echo esc_html($uniqid); ?> .ep_nft_title{
                display: <?php echo (($params['nfttitle'] == 'yes') || ($params['nfttitle'] == 'true'))? 'inherit' : 'none!important'; ?>;
            }
            <?php echo esc_html($uniqid); ?> .ep_nft_creator{
                display: <?php echo (($params['nftcreator'] == 'yes') || ($params['nftcreator'] == 'true'))? 'flex' : 'none!important'; ?>;
            }
            <?php echo esc_html($uniqid); ?> .ep_current_price{
                display: <?php echo (($params['nftprice'] == 'yes') || ($params['nftprice'] == 'true'))? 'flex' : 'none!important'; ?>;
            }
            <?php echo esc_html($uniqid); ?> .ep_nft_last_sale{
                display: <?php echo (($params['nftlastsale'] == 'yes') || ($params['nftlastsale'] == 'true'))? 'flex' : 'none!important'; ?>;
            }
            <?php echo esc_html($uniqid); ?> .ep_nft_button{
                display: <?php echo (($params['nftbutton'] == 'yes') || ($params['nftbutton'] == 'true'))? 'inherit' : 'none!important'; ?>;
            }
            <?php echo esc_html($uniqid); ?> .ep_nft_content_wrap {
                grid-template-columns: repeat(auto-fit, minmax(<?php echo esc_html($nftperrow); ?>, 1fr))!important;
            }
            
        </style>
    <?php
    }

}
