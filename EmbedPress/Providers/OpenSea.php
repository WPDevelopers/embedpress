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
    protected $allowedParams = [ 'maxwidth', 'maxheight' ];

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

    public function getCollection($url) {
        preg_match('~opensea\.io/collection/(.*)~i', (string) $url, $matches);

        if(!empty($matches[1])){
            $html = "";
            $params = $this->getParams();
            $param = array(
                'limit' => 6,
                'order_direction' => 'desc',
                'collection_slug' => $matches[1],
            );
            $url = "https://api.opensea.io/api/v1/assets?" . http_build_query($param);

            $results = wp_remote_get($url, [
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => "b61c8a54123d4dcb9acc1b9c26a01cd1",
                )
            ]);
            if (!is_wp_error($results) ) {
                $jsonResult = json_decode($results['body']);
                // wp_send_json($jsonResult);

                $html = print_r($jsonResult, true);
            }

            ob_start();  ?>
                
                <div class="ep-parent-wrapper ep-parent-ep-nft-gallery-r1a5mbx ">
                    <div class="ep-nft-gallery-wrapper ep-nft-gallery-r1a5mbx" data-id="ep-nft-gallery-r1a5mbx">
                        <div class="ep_nft_content_wrap ep_nft_grid nft_items preset-1">
                            <?php
                                foreach ($jsonResult->assets as $key => $asset) {
                                    $asset = $this->normalizeJSONData($asset);
                                    print_r($asset);
                                }
                            ?>
                        </div>
                    </div>
                </div>
                
                <?php $this->nftCardStyle(); ?>
    
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
        $result = [];
        $result['id'] = $asset->id;
        $result['name'] = $asset->name;
        $result['permalink'] = $asset->permalink;
        $result['description'] = $asset->description;
        $result['image_url'] = $asset->image_url;
        $result['image_thumbnail_url'] = $asset->image_thumbnail_url;
        $result['image_preview_url'] = $asset->image_preview_url;

        return $this->nftItemTemplate($result);
    }

    /**
     * NFT Collection Item template
     */

     public function nftItemTemplate($data){
        $name = $data['name']; 
        if(empty($data['name'])){
            $name = '#'.$data['id'];
        }
        $template = '
                <div class="ep_nft_item">
                    <div class="ep_nft_thumbnail"><img
                            src="'.$data['image_url'].'"
                            alt="Dopamine"></div>
                    <div class="ep_nft_content">
                        <h3 class="ep_nft_title">'.esc_html($name).'</h3>
                        <div class="ep_nft_content_body">
                            <div class="ep_nft_owner_wrapper">
                                <div class="ep_nft_creator"><img
                                        src="https://storage.googleapis.com/opensea-static/opensea-profile/21.png"
                                        alt="tiffatronn"><span>Created by <a target="_blank"
                                            href="https://opensea.io/0x4de5ae339b406a8cd5037e9138a62e86aa5352ef">tiffatronn</a></span>
                                </div>
                            </div>
                            
                            <div class="ep_nft_price_wrapper">
                                <div class="ep_nft_price"><span class="ebnft_label">Price:</span><span
                                        class="ebnft_currency"><svg width="1535" height="2500" viewBox="0 0 256 417"
                                            xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                            <path fill="#343434"
                                                d="m127.961 0-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"></path>
                                            <path fill="#8C8C8C" d="M127.962 0 0 212.32l127.962 75.639V154.158z"></path>
                                            <path fill="#3C3C3B"
                                                d="m127.961 312.187-1.575 1.92v98.199l1.575 4.6L256 236.587z"></path>
                                            <path fill="#8C8C8C" d="M127.962 416.905v-104.72L0 236.585z"></path>
                                            <path fill="#141414" d="m127.961 287.958 127.96-75.637-127.96-58.162z"></path>
                                            <path fill="#393939" d="m0 212.32 127.96 75.638v-133.8z"></path>
                                        </svg></span><span class="ebnft_price">0.72</span></div>
                            </div>
                        </div>
                        <div class="ep_nft_button"><a target="_blank"
                                    href="'.esc_url($data['permalink']).'">See
                                    Details</a></div>
                    </div>

                </div>   
            ';
        return $template;
     }


     /**
     * NFT card frontend style
     */

    public function nftCardStyle(){?>
    <style>

        .ose-opensea {
            height: 100%!important;
        }
        .ep_nft_content_wrap.ep_nft_grid{
            display: grid;      
        }

        .ep_nft_content_wrap.ep_nft_grid,
        .ep_nft_content_wrap.ep_nft_list {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            grid-column-gap: 15px;
            grid-row-gap: 15px;
        }

        .ep_nft_content_wrap .ep_nft_item {
            padding-top: 15px;
            padding-right: 15px;
            padding-left: 15px;
            padding-bottom: 15px;
            background-color: #ffffff;
            border-radius: 10px;
            transition: background 0.5s, border 0.5s, border-radius 0.5s, box-shadow 0.5s;
            
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0,0,0,.09);
            overflow: hidden;
            padding: 15px;
            position: relative;
            transition: .3s ease-in-out;
        }

         .ep_nft_content_wrap.ep_nft_list .ep_nft_item {
            justify-content: flex-start;
            align-items: flex-start;
        }

         .ep_nft_content_wrap.ep_nft_grid.preset-3 .ep_nft_item .ep_nft_content {
            background-color: #edecf6e6;
        }

         .ep_nft_content_wrap .ep_nft_thumbnail {
            margin-top: 0px;
            margin-right: 0px;
            margin-left: 0px;
            margin-bottom: 15px;
            border-radius: 5px;
        }

         .ep_nft_content_wrap .ep_nft_thumbnail img {
            height: 300px;
            border-radius: 5px;
        }

         .ep_nft_content .ep_nft_title {
            color: #333333;
            font-size: 16px;
            margin-top: 0px;
            margin-right: 0px;
            margin-left: 0px;
            margin-bottom: 15px;
            font-weight: 600 
        }
        .ep_nft_content {
            text-align: left;
        }

         .ep_nft_content .ep_nft_price {
            color: #333333;
            font-size: 14px;
            margin-top: 0px;
            margin-right: 0px;
            margin-left: 0px;
            margin-bottom: 0px;
            display: flex;
            font-weight: 600;
        }
        span.ebnft_currency {
            max-width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        span.ebnft_currency svg {
            width: 100%;
            height: auto;
        }

         .ep_nft_content .ep_nft_price_wrapper {
            min-height: 20px;
        }
        

         .ep_nft_content .ep_nft_creator {
            color: #333333;
            font-size: 14px;
            margin-top: 0px;
            margin-right: 0px;
            margin-left: 0px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

         .ep_nft_content .ep_nft_creator a {
            color: #7967ff;
            font-size: 14px;
            text-decoration: none;
        }

         .ep_nft_content .ep_nft_creator img {
            height: 30px;
            width: 30px;
            border-radius: 50%;
        }

         .ep_nft_content .ep_nft_button button {
            margin-top: 0px;
            margin-right: 0px;
            margin-left: 0px;
            margin-bottom: 0px;
        }

         .ep_nft_content .ep_nft_button button a {
            background-color: #7967ff;
            color: #ffffff;
            font-size: 14px;
            padding-top: 15px;
            padding-right: 20px;
            padding-left: 20px;
            padding-bottom: 15px;
            transition: border 0.5s, border-radius 0.5s, box-shadow 0.5s;
        }

         .ep_nft_content .ep_nft_button button:hover a {
            background-color: #5c4bd9;
            color: #ffffff;
        }

        .ep-nft-gallery-wrapper .ep_nft_content_wrap.ep_nft_grid.preset-1 .ep_nft_item:hover .ep_nft_button {
            opacity: 1;
            transform: translate(0);
            visibility: visible;
        }
        

        .ep-nft-gallery-wrapper.ep-nft-gallery-r1a5mbx .ep_nft_content .ep_nft_button:hover a {
            background-color: #5c4bd9;
            color: #ffffff;
        }

        .ep-nft-gallery-wrapper .ep_nft_content_wrap.ep_nft_grid.preset-1 .ep_nft_item:hover .ep_nft_button {
            opacity: 1;
            transform: translate(0);
            visibility: visible;
        }

        .ep-nft-gallery-wrapper .ep_nft_content_wrap.ep_nft_grid.preset-1 .ep_nft_item .ep_nft_button {
            bottom: 0;
            left: 0;
            opacity: 0;
            position: absolute;
            transform: translateY(30px);
            visibility: hidden;
            width: 100%;
            transition:0.3s;
        }

        .ep-nft-gallery-wrapper.ep-nft-gallery-r1a5mbx .ep_nft_content .ep_nft_button a {
            background-color: #7967ff;
            color: #ffffff;
            font-size: 14px;
            padding: 10px 20px;
            transition: border 0.5s, border-radius 0.5s, box-shadow 0.5s;
            display: block;
            text-align: center;
            font-weight: 500;
            text-decoration: none;
        }

        /* mimmikcssStart */




        /* mimmikcssEnd */

        @media all and (max-width: 1024px) {

            /* tabcssStart */
             .ep_nft_content_wrap.ep_nft_grid,
             .ep_nft_content_wrap.ep_nft_list {
                grid-template-columns: repeat(, 1fr);
            }

            /* tabcssEnd */

        }

        @media all and (max-width: 767px) {

            /* mobcssStart */
             .ep_nft_content_wrap.ep_nft_grid,
             .ep_nft_content_wrap.ep_nft_list {
                grid-template-columns: repeat(, 1fr);
            }

            /* mobcssEnd */

        }
    </style>
   <?php
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

}
