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
        'itemperpage',
        'loadmore',
        'loadmorelabel',
        'loadmoreTextColor',
        'loadmoreBackgroundColor',
        'loadmoreTextFontsize',
        'orderby',
        'layout',
        'layout-single',
        'preset',
        'nftperrow',
        'gapbetweenitem',
        'nftimage',
        'collectionname',
        'nftrank',
        'label_nftrank',
        'nftdetails',
        'label_nftdetails',
        'nftcreator',
        'prefix_nftcreator',
        'nfttitle',
        'nftprice',
        'prefix_nftprice',
        'nftlastsale',
        'prefix_nftlastsale',
        'nftbutton',
        'label_nftbutton',
        'itemBGColor',
        'collectionNameColor',
        'collectionNameFZ',
        'titleColor',
		'titleFontsize',
		'creatorColor',
		'creatorFontsize',
		'creatorLinkColor',
		'creatorLinkFontsize',
		'priceLabelColor',
		'priceLabelFontsize',
		'priceColor',
		'priceFontsize',
		'priceUSDColor',
		'priceUSDFontsize',
		'lastSaleLabelColor',
		'lastSaleLabelFontsize',
		'lastSaleColor',
		'lastSaleFontsize',
		'lastSaleUSDColor',
		'lastSaleUSDFontsize',
		'buttonTextColor',
		'buttonBackgroundColor',
        'buttonFontSize',
        'rankBtnColor',
        'rankBtnFZ',
        'rankBtnBorderColor',
        'rankLabelColor',
        'rankLabelFZ',
        'detialTitleColor',
        'detialTitleFZ',
        'detailTextColor',
        'detailTextLinkColor',
        'detailTextFZ',
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

    public function __construct($url, array $config = [])
    {
        parent::__construct($url, $config);
        add_filter('embedpress_render_dynamic_content', [$this, 'fakeDynamicResponse'], 10, 2);
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

    /**
     * Get Opensea single assets data
     */
    public function getAssets($url) {
        preg_match('~opensea\.io/assets/.*/([a-zA-Z0-9]+)/([a-zA-Z0-9]+)~i', (string) $url, $matches);

        $opensea_settings = get_option( EMBEDPRESS_PLG_NAME.':opensea');

        $params = $this->getParams();

        $api_key = 'e63d36afdf3f424d9adf1a06269d7ee3';
        
        if(!empty($opensea_settings['api_key'])){
            $api_key = $opensea_settings['api_key'];
        }
        
        
        if(!empty($matches[1]) && !empty($matches[2])){



            $param = array(
                'include_orders' => true,
            );
            
            $url = "https://api.opensea.io/api/v2/chain/ethereum/contract/$matches[1]/nfts/$matches[2]?" . http_build_query($param);

            // echo $url; die;
            
            $asset_cache_key = md5($url . $api_key) . '_asset_cache';
            $asset = get_transient($asset_cache_key);
            
            if (empty($asset)) {
                $results = wp_remote_get($url, [
                    'headers' => array(
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $api_key,
                    )
                ]);
            
                if (!is_wp_error($results)) {
                    $jsonResult = json_decode($results['body']);
                    $asset = $this->nftNormalizeJSONData($jsonResult);
                    set_transient($asset_cache_key, $asset, DAY_IN_SECONDS);
                }


            }
            else{
                if(empty($asset['id'])){
                    delete_transient( $asset_cache_key );
                }
            }

            if(isset($asset['id']) && $asset['collection_slug']){
                $current_price = $this->getNFTCurrentPrice($api_key, $asset['collection_slug'], $asset['id']);
            }

            // print_r($asset); die;
            
            $template = $this->nftSingleItemTemplate($asset, $current_price);
            
            ob_start();

            ?>
            

                <div class="ep-parent-wrapper ep-parent-ep-nft-gallery-r1a5mbx ">
                    <div class="ep-nft-gallery-wrapper ep-nft-gallery-r1a5mbx" data-id="ep-nft-gallery-r1a5mbx">
                        <div class="ep_nft_content_wrap ep_nft__wrapper nft_items ep-nft-single-item-wraper ep-list">
                            <?php  print_r($template); ?>
                        </div>
                    </div>
                </div>

            <?php $html = ob_get_clean();

            // wp_send_json($html);

            return $html;

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

        $api_key = 'e63d36afdf3f424d9adf1a06269d7ee3';
        $orderby = 'desc';

        if(!empty($opensea_settings['api_key'])){
            $api_key = $opensea_settings['api_key'];
        }
        if(!empty($opensea_settings['orderby'])){
            $orderby = $opensea_settings['orderby'];
        }

         //This limit comes from Global Opensea Settings
         $limit = 20;
        if(!empty($opensea_settings['limit'])){
            $limit = $opensea_settings['limit'];
        }


        if(!empty($matches[1])){
            $html = "";
            $params = $this->getParams();



            //This limit comes from Elementor and Gutenberg
            if(! empty( $params['limit'] ) &&  $params['limit']  != 'false'){
                $limit =  $params['limit'];
            }

            if(! empty( $params['loadmore'] ) &&  $params['loadmore']  != 'false'){
                $loadmore =  $params['loadmore'];

                if(! empty( $params['itemperpage'] ) &&  $params['itemperpage']  != 'false'){
                    $itemperpage =  $params['itemperpage'];
                }
            }
            else{
                $itemperpage =  $limit;
            }
            
            if(! empty( $params['orderby'] ) &&  $params['orderby']  != 'false'){
                $orderby =  $params['orderby'];
            }
            $loadmorelabel = '';
            if(! empty( $params['loadmorelabel'] ) &&  $params['loadmorelabel']  != 'false' &&  $params['loadmorelabel']  != 'true'){
                $loadmorelabel =  $params['loadmorelabel'];
            }

            // Embepress NFT item layout
            $ep_layout = 'ep-grid';
            $ep_preset= '';
            
            if(! empty( $params['layout'] )){
                $ep_layout =  $params['layout'];
            }

            if( ! empty( $params['layout'] ) && $params['layout'] == 'ep-grid'){
                if(! empty( $params['preset'] )){
                    $ep_preset =  $params['preset'];
                }
            }

            $param = array(
                'limit' => $limit,
                'order_direction' => $orderby,
                'include_orders' => true,
            );

            $url = "https://api.opensea.io/api/v2/collection/$matches[1]/nfts?" . http_build_query($param);

            $collection_assets_key = md5($url . $api_key) . '_collection_assets_cache';

            $collection_asset = get_transient($collection_assets_key);

            if (false === $collection_asset) {
                $results = wp_remote_get($url, [
                    'headers' => array(
                        'Content-Type' => 'application/json',
                        'X-API-KEY' => $api_key,
                    )
                ]);


                if (!is_wp_error($results) ) {
                    $jsonResult = json_decode($results['body']);



                    if(isset($jsonResult->nfts) && is_array($jsonResult->nfts)){
                        $collection_asset = array();
                        foreach ($jsonResult->nfts as $key => $asset) {
                            $collection_asset[] = $this->normalizeJSONData($asset);
                        }
                        set_transient($collection_assets_key, $collection_asset, DAY_IN_SECONDS);
                    }
                }
            }
            else{
                if(is_array($collection_asset)) : $id = $collection_asset[0]; endif;
                if( empty($id['id'])){
                    delete_transient($collection_assets_key);
                }
            }

            ob_start();
            ?>

                <?php if(!empty($collection_asset) && is_array($collection_asset) ): ?> 
                <div class="ep-parent-wrapper ep-parent-ep-nft-gallery-r1a5mbx ">
                    <div class="ep-nft-gallery-wrapper ep-nft-gallery-r1a5mbx" data-id="ep-nft-gallery-r1a5mbx" data-loadmorelabel="<?php echo esc_attr($loadmorelabel); ?>" data-itemparpage="<?php echo esc_attr($itemperpage); ?>" data-nftid="<?php echo esc_attr( 'ep-'.md5($url .uniqid()) ); ?>">
                        <div class="ep_nft_content_wrap ep_nft__wrapper nft_items <?php echo esc_attr( $ep_layout.' '.$ep_preset ); ?>"  >
                            <?php
                                foreach ($collection_asset as $key => $asset) {
                                    $template = $this->nftItemTemplate($asset);
                                    print_r($template);
                                }
                            ?>
                        </div>
                        <?php if(!empty($loadmore)):  ?>
                            <?php if((isset($params['limit']) && isset($params['itemperpage'])) && $params['limit'] > $params['itemperpage']) : ?>
                                <div class="ep-loadmore-wrapper">
                                    <button class="btn btn-primary nft-loadmore" data-iconcolor="<?php echo esc_attr($this->getColor('loadmoreTextColor') ); ?>" <?php echo $this->createStye('loadmoreTextColor', 'loadmoreTextFontsize', 'loadmoreBackgroundColor')?>> <?php echo esc_html($loadmorelabel); ?></button>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </div>
                
                <?php $this->openSeaStyle($this->getParams()); ?>
                <?php else: ?>
                    <?php if(is_wp_error( $results ) && defined('WP_DEBUG') && WP_DEBUG): ?>
                        <h4 style="text-align: center"><?php echo esc_html($results->get_error_message()); ?></h4>
                    <?php elseif(isset($jsonResult->errors[0])): ?>
                        <h4 style="text-align: center"><?php echo esc_html($jsonResult->errors[0]); ?></h4>
                    <?php else: ?>
                        <h4 style="text-align: center"><?php echo esc_html__('Something went wrong.', 'embedpress'); ?></h4>
                    <?php endif; ?>
                <?php endif; ?>

            <?php $html = ob_get_clean();
            
            return $html;
        }
        return "";
    }

    public function getNFTCurrentPrice($api_key, $collection_slug, $token_id){


        $url = "https://api.opensea.io/api/v2/listings/collection/$collection_slug/nfts/$token_id/best";

        // print_r($url); die;

        $price_cache_key = md5($url . $api_key) . '_nft_price_cache';
        $nft_price = get_transient($price_cache_key);
            
        if (empty($nft_price)) {
            $results = wp_remote_get($url, [
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'X-API-KEY' => $api_key,
                )
            ]);
        
            if (!is_wp_error($results)) {
                $jsonResult = json_decode($results['body']);
                $nft_price = $jsonResult->price->current->value ?? 0 / 1000000000000000000;
                set_transient($price_cache_key, $nft_price, DAY_IN_SECONDS);
            }
        }
        else{
            if(empty($nft_price)){
                delete_transient( $price_cache_key );
            }
        }

        return $nft_price;
    }

    /**
     * Normalize json data
     */
    public function normalizeJSONData($asset){

        $nftItem = [];        
        $current_price = isset($asset->seaport_sell_orders)?$asset->seaport_sell_orders:0;
        $last_sale = isset($asset->last_sale->total_price)?$asset->last_sale->total_price:0;

        $nftItem['id'] = isset($asset->identifier)?$asset->identifier:'';
        $nftItem['name'] = isset($asset->name)?$asset->name:'';
        $nftItem['permalink'] = isset($asset->opensea_url)?$asset->opensea_url:'';
        $nftItem['description'] = isset($asset->description)?$asset->description:'';
        $nftItem['image_url'] = isset($asset->image_url)?$asset->image_url:'';
        $nftItem['image_thumbnail_url'] = isset($asset->image_thumbnail_url)?$asset->image_thumbnail_url:'';
        $nftItem['image_preview_url'] = isset($asset->image_preview_url)?$asset->image_preview_url:'';
        $nftItem['image_original_url'] = isset($asset->image_original_url)?$asset->image_original_url:'';
        $nftItem['created_by'] = isset($asset->creator->user->username)?$asset->creator->user->username:'';
        $nftItem['creator_img_url'] = isset($asset->asset_contract->image_url)?$asset->asset_contract->image_url:'';

        $nftItem['current_price'] = isset($current_price[0]->current_price)?(float)($current_price[0]->current_price / 1000000000000000000) : 0;
        $nftItem['last_sale'] = isset($asset->last_sale->total_price)?(float)($asset->last_sale->total_price / 1000000000000000000) : 0;
        $nftItem['creator_url'] = 'https://opensea.io/'.$nftItem['created_by'];

        return $nftItem;
    }

    public function nftNormalizeJSONData($asset){

        
 

       $nftItem = [];

        $nft = $asset->nft;

        $nftItem['id'] = isset($nft->identifier) ? $nft->identifier : '';
        $nftItem['name'] = isset($nft->name) ? $nft->name : '';
        $nftItem['permalink'] = isset($nft->opensea_url) ? $nft->opensea_url : '';
        $nftItem['description'] = isset($nft->description) ? $nft->description : '';
        $nftItem['image_url'] = isset($nft->image_url) ? $nft->image_url : '';
        // Add other image properties as needed

        $nftItem['created_by'] = isset($nft->creator) ? $nft->creator : '';
        // Add other creator properties as needed

        // Traits
        $traits = isset($nft->traits) ? $nft->traits : [];
        $traitValues = array_column($traits, 'value');
        $nftItem['traits'] = implode(', ', $traitValues);

        // Owners
        $owners = isset($nft->owners) ? $nft->owners : [];
        $ownerAddresses = array_column($owners, 'address');
        $nftItem['owner_addresses'] = $ownerAddresses;

        // Rarity
        $rarity = isset($nft->rarity) ? $nft->rarity : '';
        $nftItem['rank'] = isset($rarity->rank) ? $rarity->rank : 0;
        // Add other rarity properties as needed

        // Collection
        $nftItem['collection_name'] = isset($nft->collection) ? $nft->collection : '';
        $nftItem['contract_address'] = isset($nft->contract) ? $nft->contract : '';
        $nftItem['token_standard'] = isset($nft->token_standard) ? $nft->token_standard : '';
        $nftItem['collection_slug'] = isset($nft->collection) ? $nft->collection : '';
        $nftItem['verified'] = isset($nft->creator->config) ? $nft->creator->config : '';

        // Calculate USD price if available
        // $usdPrice = isset($current_price->price->current->value) ? $current_price : '';
        // $nftItem['usd_price'] = is_numeric($usdPrice) ? (float)$usdPrice : '';

        return $nftItem;
    }

    //Get colors from Gutenberg
    public function getColor($datakey){
        $params = $this->getParams();
        $color = '';
        if(!empty($params[$datakey]) && $params[$datakey] != 'true'){
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
    public function createStye($colorKey, $fontsizeKey, $bgKey){ 
        $color = $this->getColor($colorKey);
        $fontsize = $this->getFontsize($fontsizeKey);
        $buttonBg = $this->getColor($bgKey);

        if($color == 'true'){
            $color = '';
        }
        if($fontsize == 'true'){
            $fontsize = '';
        }
        if($buttonBg == 'true'){
            $buttonBg = '';
        }

        $itemStyle = ''; 
        $BgColor = '';
        $FontSize = '';
        $TextColor = '';
        $borderColor = '';

        if(!empty($color)){
            $TextColor = "color:{$color};";
        }
        if(!empty($fontsize)){
            $FontSize = "font-size:{$fontsize}px;";
        }
        
        if(!empty($bgKey) && !empty($this->getColor($bgKey)) && !empty($buttonBg)){
            $BgColor = 'background-color: '. $buttonBg;

            if($bgKey == 'rankBtnBorderColor'){
                $BgColor = 'border-color: '. $buttonBg;;
            }
        }

        if((!empty($TextColor)) || (!empty($FontSize)) || (!empty($BgColor))){
            $itemStyle = $itemStyle . "style='{$TextColor}{$FontSize}{$BgColor}'";
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
            'nftlastsale' => true,
            'layout' => 'ep-grid',
            'preset' => 'ep-preset-2',
            'prefix_nftcreator' => 'Created By',
            'prefix_nftprice' => 'Price',
            'prefix_nftlastsale' => 'Last Sale',
            'label_nftbutton' => 'See Details',
            
        ] );

      

        //Intialize default value
        $thumbnail = '';
        $title = '';
        $creator = '';
        $prefix_creator = '';
        $current_price = 0;
        $prefix_current_price = '';
        $last_sale = 0;
        $prefix_last_sale = '';
        $nftbutton = '';
        $label_nftbutton = '';

        $current_price_template = '';
        $last_sale_price_template = ''; 

        // Assgined current value
        $name = $item['name'] ? $item['name'] : '#'.$item['id'];

        $image_url = $item['image_url'] ? $item['image_url'] : ($item['image_thumbnail_url']?$item['image_thumbnail_url'] : ($item['image_preview_url']?$item['image_preview_url'] : $item['image_original_url']));
        

        
        $img_placeholder = '
            <svg viewBox="0 0 320 330" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H320V330H0V0Z" fill="url(#paint0_linear_16_5)"></path><g opacity="0.15" clip-path="url(#clip0_16_5)"><path d="M136.04 172.213C129.37 172.213 123.436 167.942 121.282 161.584L121.136 161.105C120.628 159.421 120.415 158.005 120.415 156.588V128.178L110.306 161.921C109.006 166.884 111.969 172.029 116.94 173.4L181.371 190.655C182.175 190.864 182.979 190.964 183.771 190.964C187.921 190.964 191.713 188.209 192.775 184.15L196.529 172.213H136.04Z" fill="white"></path><path d="M147.499 128.462C152.095 128.462 155.832 124.724 155.832 120.128C155.832 115.532 152.095 111.795 147.499 111.795C142.903 111.795 139.165 115.532 139.165 120.128C139.165 124.724 142.903 128.462 147.499 128.462Z" fill="white"></path><path opacity="0.5" d="M199.583 99.2943H137.081C131.34 99.2943 126.665 103.97 126.665 109.712V155.546C126.665 161.288 131.34 165.963 137.081 165.963H199.583C205.325 165.963 210 161.288 210 155.546V109.712C210 103.97 205.325 99.2943 199.583 99.2943ZM137.081 107.628H199.583C200.733 107.628 201.666 108.561 201.666 109.712V139.292L188.504 123.932C187.108 122.295 185.087 121.42 182.916 121.37C180.758 121.383 178.733 122.341 177.349 124L161.874 142.575L156.832 137.545C153.982 134.696 149.344 134.696 146.498 137.545L134.998 149.041V109.712C134.998 108.561 135.931 107.628 137.081 107.628Z" fill="white"></path></g><path d="M60.746 217.336H62.798V229H60.746V217.336ZM64.9331 220.036H66.9311V229H64.9331V220.036ZM70.7111 219.838C71.2271 219.838 71.7011 219.91 72.1331 220.054C72.5771 220.198 72.9551 220.42 73.2671 220.72C73.5911 221.008 73.8371 221.368 74.0051 221.8C74.1851 222.232 74.2751 222.742 74.2751 223.33V229H72.2771V223.726C72.2771 222.994 72.0971 222.454 71.7371 222.106C71.3891 221.746 70.8371 221.566 70.0811 221.566C69.5051 221.566 68.9771 221.692 68.4971 221.944C68.0291 222.184 67.6451 222.502 67.3451 222.898C67.0451 223.282 66.8711 223.708 66.8231 224.176L66.8051 223.204C66.8651 222.76 66.9971 222.34 67.2011 221.944C67.4051 221.536 67.6751 221.176 68.0111 220.864C68.3471 220.54 68.7431 220.288 69.1991 220.108C69.6551 219.928 70.1591 219.838 70.7111 219.838ZM77.8571 219.838C78.3851 219.838 78.8651 219.91 79.2971 220.054C79.7291 220.198 80.1011 220.42 80.4131 220.72C80.7371 221.008 80.9891 221.368 81.1691 221.8C81.3491 222.232 81.4391 222.742 81.4391 223.33V229H79.4231V223.726C79.4231 222.994 79.2431 222.454 78.8831 222.106C78.5351 221.746 77.9831 221.566 77.2271 221.566C76.6511 221.566 76.1231 221.692 75.6431 221.944C75.1751 222.184 74.7911 222.502 74.4911 222.898C74.2031 223.282 74.0351 223.708 73.9871 224.176L73.9511 223.168C74.0111 222.736 74.1491 222.322 74.3651 221.926C74.5811 221.518 74.8571 221.158 75.1931 220.846C75.5291 220.534 75.9191 220.288 76.3631 220.108C76.8191 219.928 77.3171 219.838 77.8571 219.838ZM86.9122 229.198C86.0962 229.198 85.3462 229 84.6622 228.604C83.9902 228.208 83.4502 227.662 83.0422 226.966C82.6462 226.258 82.4482 225.448 82.4482 224.536C82.4482 223.6 82.6522 222.784 83.0602 222.088C83.4682 221.38 84.0202 220.828 84.7162 220.432C85.4122 220.036 86.1922 219.838 87.0562 219.838C88.0162 219.838 88.7782 220.048 89.3422 220.468C89.9062 220.888 90.3082 221.452 90.5482 222.16C90.7882 222.868 90.9082 223.66 90.9082 224.536C90.9082 225.028 90.8362 225.55 90.6922 226.102C90.5482 226.642 90.3202 227.146 90.0082 227.614C89.7082 228.082 89.3002 228.466 88.7842 228.766C88.2802 229.054 87.6562 229.198 86.9122 229.198ZM87.5242 227.542C88.1962 227.542 88.7662 227.416 89.2342 227.164C89.7142 226.9 90.0742 226.54 90.3142 226.084C90.5662 225.628 90.6922 225.112 90.6922 224.536C90.6922 223.9 90.5662 223.36 90.3142 222.916C90.0622 222.46 89.7022 222.112 89.2342 221.872C88.7662 221.62 88.1962 221.494 87.5242 221.494C86.5642 221.494 85.8202 221.776 85.2922 222.34C84.7642 222.904 84.5002 223.636 84.5002 224.536C84.5002 225.124 84.6262 225.646 84.8782 226.102C85.1422 226.558 85.5022 226.912 85.9582 227.164C86.4142 227.416 86.9362 227.542 87.5242 227.542ZM90.6922 220.036H92.7082V229H90.8362C90.8362 229 90.8242 228.886 90.8002 228.658C90.7762 228.43 90.7522 228.154 90.7282 227.83C90.7042 227.494 90.6922 227.176 90.6922 226.876V220.036ZM98.1805 227.614C97.3405 227.614 96.5785 227.464 95.8945 227.164C95.2225 226.864 94.6885 226.426 94.2925 225.85C93.9085 225.274 93.7165 224.584 93.7165 223.78C93.7165 222.976 93.9025 222.28 94.2745 221.692C94.6585 221.104 95.1865 220.648 95.8585 220.324C96.5425 220 97.3165 219.838 98.1805 219.838C98.4325 219.838 98.6725 219.856 98.9005 219.892C99.1405 219.928 99.3685 219.976 99.5845 220.036L103.779 220.054V221.728C103.203 221.74 102.621 221.662 102.033 221.494C101.457 221.314 100.947 221.128 100.503 220.936L100.449 220.828C100.857 221.032 101.223 221.284 101.547 221.584C101.883 221.872 102.147 222.202 102.339 222.574C102.531 222.946 102.627 223.366 102.627 223.834C102.627 224.626 102.435 225.304 102.051 225.868C101.679 226.432 101.157 226.864 100.485 227.164C99.8245 227.464 99.0565 227.614 98.1805 227.614ZM101.061 232.654V232.24C101.061 231.652 100.887 231.238 100.539 230.998C100.191 230.758 99.7045 230.638 99.0805 230.638H96.6505C96.1705 230.638 95.7565 230.596 95.4085 230.512C95.0725 230.44 94.8025 230.326 94.5985 230.17C94.3945 230.026 94.2445 229.852 94.1485 229.648C94.0525 229.456 94.0045 229.24 94.0045 229C94.0045 228.52 94.1485 228.16 94.4365 227.92C94.7365 227.68 95.1265 227.524 95.6065 227.452C96.0985 227.38 96.6145 227.368 97.1545 227.416L98.1805 227.614C97.4725 227.638 96.9325 227.704 96.5605 227.812C96.2005 227.908 96.0205 228.106 96.0205 228.406C96.0205 228.586 96.0925 228.73 96.2365 228.838C96.3805 228.946 96.5845 229 96.8485 229H99.4045C100.137 229 100.779 229.084 101.331 229.252C101.883 229.432 102.309 229.726 102.609 230.134C102.921 230.554 103.077 231.124 103.077 231.844V232.654H101.061ZM98.1805 226.048C98.6605 226.048 99.0865 225.958 99.4585 225.778C99.8305 225.598 100.125 225.34 100.341 225.004C100.557 224.668 100.665 224.26 100.665 223.78C100.665 223.3 100.557 222.886 100.341 222.538C100.125 222.19 99.8305 221.926 99.4585 221.746C99.0865 221.566 98.6605 221.476 98.1805 221.476C97.7125 221.476 97.2865 221.566 96.9025 221.746C96.5305 221.926 96.2365 222.19 96.0205 222.538C95.8045 222.874 95.6965 223.288 95.6965 223.78C95.6965 224.26 95.8045 224.668 96.0205 225.004C96.2365 225.34 96.5305 225.598 96.9025 225.778C97.2745 225.958 97.7005 226.048 98.1805 226.048ZM112.044 226.048H113.97C113.874 226.66 113.634 227.206 113.25 227.686C112.878 228.154 112.368 228.526 111.72 228.802C111.072 229.066 110.298 229.198 109.398 229.198C108.378 229.198 107.466 229.012 106.662 228.64C105.858 228.256 105.228 227.716 104.772 227.02C104.316 226.324 104.088 225.496 104.088 224.536C104.088 223.588 104.31 222.76 104.754 222.052C105.198 221.344 105.81 220.798 106.59 220.414C107.382 220.03 108.294 219.838 109.326 219.838C110.394 219.838 111.282 220.03 111.99 220.414C112.71 220.786 113.244 221.35 113.592 222.106C113.94 222.85 114.084 223.792 114.024 224.932H106.122C106.182 225.436 106.344 225.892 106.608 226.3C106.884 226.696 107.256 227.008 107.724 227.236C108.192 227.452 108.738 227.56 109.362 227.56C110.058 227.56 110.64 227.422 111.108 227.146C111.588 226.87 111.9 226.504 112.044 226.048ZM109.272 221.458C108.456 221.458 107.784 221.662 107.256 222.07C106.728 222.466 106.386 222.976 106.23 223.6H112.008C111.96 222.928 111.69 222.406 111.198 222.034C110.706 221.65 110.064 221.458 109.272 221.458ZM129.585 226.876L128.973 227.11V217.336H131.007V229H128.973L120.225 219.514L120.855 219.28V229H118.803V217.336H120.855L129.585 226.876ZM137.576 229.198C136.58 229.198 135.686 229.018 134.894 228.658C134.102 228.298 133.478 227.77 133.022 227.074C132.566 226.378 132.338 225.532 132.338 224.536C132.338 223.552 132.566 222.712 133.022 222.016C133.478 221.308 134.102 220.768 134.894 220.396C135.686 220.024 136.58 219.838 137.576 219.838C138.572 219.838 139.46 220.024 140.24 220.396C141.02 220.768 141.632 221.308 142.076 222.016C142.532 222.712 142.76 223.552 142.76 224.536C142.76 225.532 142.532 226.378 142.076 227.074C141.632 227.77 141.02 228.298 140.24 228.658C139.46 229.018 138.572 229.198 137.576 229.198ZM137.576 227.56C138.152 227.56 138.68 227.446 139.16 227.218C139.64 226.99 140.018 226.648 140.294 226.192C140.582 225.736 140.726 225.184 140.726 224.536C140.726 223.888 140.582 223.336 140.294 222.88C140.018 222.424 139.64 222.076 139.16 221.836C138.692 221.584 138.164 221.458 137.576 221.458C136.988 221.458 136.454 221.578 135.974 221.818C135.494 222.058 135.104 222.406 134.804 222.862C134.516 223.318 134.372 223.876 134.372 224.536C134.372 225.184 134.516 225.736 134.804 226.192C135.092 226.648 135.476 226.99 135.956 227.218C136.448 227.446 136.988 227.56 137.576 227.56ZM143.058 220.036H149.394V221.674H143.058V220.036ZM145.218 217.624H147.234V229H145.218V217.624ZM155.582 226.264V224.518H162.53V226.264H155.582ZM152.882 229L157.976 217.336H160.172L165.302 229H163.088L158.624 218.47H159.524L155.078 229H152.882ZM169.668 227.578H168.966L172.062 220.036H174.24L170.28 229H168.372L164.466 220.036H166.662L169.668 227.578ZM178.607 229.198C177.791 229.198 177.041 229 176.357 228.604C175.685 228.208 175.145 227.662 174.737 226.966C174.341 226.258 174.143 225.448 174.143 224.536C174.143 223.6 174.347 222.784 174.755 222.088C175.163 221.38 175.715 220.828 176.411 220.432C177.107 220.036 177.887 219.838 178.751 219.838C179.711 219.838 180.473 220.048 181.037 220.468C181.601 220.888 182.003 221.452 182.243 222.16C182.483 222.868 182.603 223.66 182.603 224.536C182.603 225.028 182.531 225.55 182.387 226.102C182.243 226.642 182.015 227.146 181.703 227.614C181.403 228.082 180.995 228.466 180.479 228.766C179.975 229.054 179.351 229.198 178.607 229.198ZM179.219 227.542C179.891 227.542 180.461 227.416 180.929 227.164C181.409 226.9 181.769 226.54 182.009 226.084C182.261 225.628 182.387 225.112 182.387 224.536C182.387 223.9 182.261 223.36 182.009 222.916C181.757 222.46 181.397 222.112 180.929 221.872C180.461 221.62 179.891 221.494 179.219 221.494C178.259 221.494 177.515 221.776 176.987 222.34C176.459 222.904 176.195 223.636 176.195 224.536C176.195 225.124 176.321 225.646 176.573 226.102C176.837 226.558 177.197 226.912 177.653 227.164C178.109 227.416 178.631 227.542 179.219 227.542ZM182.387 220.036H184.403V229H182.531C182.531 229 182.519 228.886 182.495 228.658C182.471 228.43 182.447 228.154 182.423 227.83C182.399 227.494 182.387 227.176 182.387 226.876V220.036ZM188.219 216.238V218.164H185.825V216.238H188.219ZM186.005 220.036H188.021V229H186.005V220.036ZM189.874 216.436H191.872V229H189.874V216.436ZM197.576 229.198C196.76 229.198 196.01 229 195.326 228.604C194.654 228.208 194.114 227.662 193.706 226.966C193.31 226.258 193.112 225.448 193.112 224.536C193.112 223.6 193.316 222.784 193.724 222.088C194.132 221.38 194.684 220.828 195.38 220.432C196.076 220.036 196.856 219.838 197.72 219.838C198.68 219.838 199.442 220.048 200.006 220.468C200.57 220.888 200.972 221.452 201.212 222.16C201.452 222.868 201.572 223.66 201.572 224.536C201.572 225.028 201.5 225.55 201.356 226.102C201.212 226.642 200.984 227.146 200.672 227.614C200.372 228.082 199.964 228.466 199.448 228.766C198.944 229.054 198.32 229.198 197.576 229.198ZM198.188 227.542C198.86 227.542 199.43 227.416 199.898 227.164C200.378 226.9 200.738 226.54 200.978 226.084C201.23 225.628 201.356 225.112 201.356 224.536C201.356 223.9 201.23 223.36 200.978 222.916C200.726 222.46 200.366 222.112 199.898 221.872C199.43 221.62 198.86 221.494 198.188 221.494C197.228 221.494 196.484 221.776 195.956 222.34C195.428 222.904 195.164 223.636 195.164 224.536C195.164 225.124 195.29 225.646 195.542 226.102C195.806 226.558 196.166 226.912 196.622 227.164C197.078 227.416 197.6 227.542 198.188 227.542ZM201.356 220.036H203.372V229H201.5C201.5 229 201.488 228.886 201.464 228.658C201.44 228.43 201.416 228.154 201.392 227.83C201.368 227.494 201.356 227.176 201.356 226.876V220.036ZM210.774 229.198C210.03 229.198 209.4 229.054 208.884 228.766C208.38 228.466 207.972 228.082 207.66 227.614C207.36 227.146 207.138 226.642 206.994 226.102C206.862 225.55 206.796 225.028 206.796 224.536C206.796 223.876 206.862 223.264 206.994 222.7C207.126 222.136 207.342 221.644 207.642 221.224C207.954 220.792 208.362 220.456 208.866 220.216C209.382 219.964 210.018 219.838 210.774 219.838C211.638 219.838 212.4 220.036 213.06 220.432C213.732 220.828 214.26 221.38 214.644 222.088C215.04 222.784 215.238 223.6 215.238 224.536C215.238 225.448 215.04 226.258 214.644 226.966C214.248 227.662 213.714 228.208 213.042 228.604C212.37 229 211.614 229.198 210.774 229.198ZM210.162 227.542C210.774 227.542 211.302 227.416 211.746 227.164C212.202 226.912 212.556 226.558 212.808 226.102C213.06 225.646 213.186 225.124 213.186 224.536C213.186 223.636 212.922 222.904 212.394 222.34C211.866 221.764 211.122 221.476 210.162 221.476C209.502 221.476 208.932 221.602 208.452 221.854C207.984 222.106 207.624 222.46 207.372 222.916C207.132 223.36 207.012 223.9 207.012 224.536C207.012 225.112 207.132 225.628 207.372 226.084C207.624 226.54 207.984 226.9 208.452 227.164C208.92 227.416 209.49 227.542 210.162 227.542ZM207.012 216.436V226.876C207.012 227.2 206.994 227.566 206.958 227.974C206.922 228.382 206.886 228.724 206.85 229H204.996V216.436H207.012ZM216.454 216.436H218.452V229H216.454V216.436ZM227.648 226.048H229.574C229.478 226.66 229.238 227.206 228.854 227.686C228.482 228.154 227.972 228.526 227.324 228.802C226.676 229.066 225.902 229.198 225.002 229.198C223.982 229.198 223.07 229.012 222.266 228.64C221.462 228.256 220.832 227.716 220.376 227.02C219.92 226.324 219.692 225.496 219.692 224.536C219.692 223.588 219.914 222.76 220.358 222.052C220.802 221.344 221.414 220.798 222.194 220.414C222.986 220.03 223.898 219.838 224.93 219.838C225.998 219.838 226.886 220.03 227.594 220.414C228.314 220.786 228.848 221.35 229.196 222.106C229.544 222.85 229.688 223.792 229.628 224.932H221.726C221.786 225.436 221.948 225.892 222.212 226.3C222.488 226.696 222.86 227.008 223.328 227.236C223.796 227.452 224.342 227.56 224.966 227.56C225.662 227.56 226.244 227.422 226.712 227.146C227.192 226.87 227.504 226.504 227.648 226.048ZM224.876 221.458C224.06 221.458 223.388 221.662 222.86 222.07C222.332 222.466 221.99 222.976 221.834 223.6H227.612C227.564 222.928 227.294 222.406 226.802 222.034C226.31 221.65 225.668 221.458 224.876 221.458ZM244.936 217.336L240.184 225.202V229H238.132V225.202L233.38 217.336H235.738L239.752 224.212H238.636L242.596 217.336H244.936ZM251.486 226.048H253.412C253.316 226.66 253.076 227.206 252.692 227.686C252.32 228.154 251.81 228.526 251.162 228.802C250.514 229.066 249.74 229.198 248.84 229.198C247.82 229.198 246.908 229.012 246.104 228.64C245.3 228.256 244.67 227.716 244.214 227.02C243.758 226.324 243.53 225.496 243.53 224.536C243.53 223.588 243.752 222.76 244.196 222.052C244.64 221.344 245.252 220.798 246.032 220.414C246.824 220.03 247.736 219.838 248.768 219.838C249.836 219.838 250.724 220.03 251.432 220.414C252.152 220.786 252.686 221.35 253.034 222.106C253.382 222.85 253.526 223.792 253.466 224.932H245.564C245.624 225.436 245.786 225.892 246.05 226.3C246.326 226.696 246.698 227.008 247.166 227.236C247.634 227.452 248.18 227.56 248.804 227.56C249.5 227.56 250.082 227.422 250.55 227.146C251.03 226.87 251.342 226.504 251.486 226.048ZM248.714 221.458C247.898 221.458 247.226 221.662 246.698 222.07C246.17 222.466 245.828 222.976 245.672 223.6H251.45C251.402 222.928 251.132 222.406 250.64 222.034C250.148 221.65 249.506 221.458 248.714 221.458ZM253.757 220.036H260.093V221.674H253.757V220.036ZM255.917 217.624H257.933V229H255.917V217.624Z" fill="white"></path><defs><linearGradient id="paint0_linear_16_5" x1="326.4" y1="1.29268e-05" x2="-63.6095" y2="214.16" gradientUnits="userSpaceOnUse"><stop stop-color="#275EFF"></stop><stop offset="1" stop-color="#A913FF"></stop></linearGradient><clipPath id="clip0_16_5"><rect width="100" height="100" fill="white" transform="translate(110 95)"></rect></clipPath></defs></svg>
        ';

        if(empty($image_url)){
            $img_thumb = $img_placeholder;
        }
        else{
            $img_thumb = '<img
            src="'.esc_url($image_url).'"
            alt="'.esc_attr($name).'">';
        }

        $created_by = $item['created_by'];

        $creator_img_url = $item['creator_img_url'];
        
        $current_price = $item['current_price'];
    

        if(!empty($item['last_sale'] && $item['last_sale'] > 0) ){
            $last_sale = $item['last_sale'];
        }

        // Checked and assigned prefix text value 
        if(!empty($params['prefix_nftcreator']) && $params['prefix_nftcreator'] != 'false' && $params['prefix_nftcreator'] != 'true'){
            $prefix_creator = $params['prefix_nftcreator'];
        }

        if(!empty($params['prefix_nftprice']) && $params['prefix_nftprice'] != 'false' && $params['prefix_nftprice'] != 'true'){
            $prefix_current_price = $params['prefix_nftprice'];
        } 
        if(!empty($params['prefix_nftlastsale'])  && $params['prefix_nftlastsale'] != 'false' && $params['prefix_nftlastsale'] != 'true'){
            $prefix_last_sale = $params['prefix_nftlastsale'];
        }
        if(!empty($params['label_nftbutton']) && $params['label_nftbutton'] != 'false' && $params['label_nftbutton'] != 'true'){
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
            <div class="ep_nft_price ep_current_price" '.$this->createStye('priceColor', 'priceFontsize', '').'>
                <span class="eb_nft_label">'.esc_html($prefix_current_price).'</span>
                <span  class="eb_nft_currency">'.$eth_icon.'</span>
                <span class="eb_nft_price">'. esc_html(round($current_price, 4)).'</span>
            </div>
            ';
        }

        if(!empty($last_sale) && (($last_sale > 0) && (($params['nftlastsale'] == 'yes') || ($params['nftlastsale'] == 'true')))){
            $last_sale_price_template = '
            <div class="ep_nft_price ep_nft_last_sale" '.$this->createStye('lastSaleColor', 'lastSaleFontsize', '').'>
                <span class="eb_nft_label">'.esc_html($prefix_last_sale).'</span>
                <span  class="eb_nft_currency">'.$eth_icon.'</span>
                <span class="eb_nft_price">'. esc_html(round($last_sale, 4)).'</span>
            </div>
            ';
        }

        if(($params['nftimage'] == 'yes') || ($params['nftimage'] == 'true')):
            $thumbnail = '<div class="ep_nft_thumbnail">'.$img_thumb.'</div>';
        endif;

        if((($params['nftcreator'] == 'yes') || ($params['nftcreator'] == 'true')) && !empty($created_by)):
            $creator = '<div class="ep_nft_owner_wrapper">
                <div class="ep_nft_creator">';
            if(!empty($creator_img_url)) {
                $creator .= '<img src="'.esc_url($creator_img_url).'" alt="'.esc_attr($created_by).'">';
            }
            $creator .= '<span '.$this->createStye('creatorColor', 'creatorFontsize', '').'>'.esc_html($prefix_creator).' <a target="_blank"
                        href="'.esc_url($item['creator_url']).'" '.$this->createStye('creatorLinkColor', 'creatorLinkFontsize', '').'>'.esc_html($created_by).'</a></span>
                </div>
            </div>';
        endif;
        
        if(($params['nfttitle'] == 'yes') || ($params['nfttitle'] == 'true')):
            $title = ' <h3 class="ep_nft_title" '.$this->createStye('titleColor', 'titleFontsize', '').'>'.esc_html($name).'</h3>';
        endif;

        if(($params['nftbutton'] == 'yes') || ($params['nftbutton'] == 'true')):
            $nftbutton = '<div class="ep_nft_button">
                <a target="_blank" href="'.esc_url($item['permalink']).'" '.$this->createStye('buttonTextColor', 'buttonFontSize', 'buttonBackgroundColor').'>'.esc_html($label_nftbutton).'</a>
                </div>';
        endif;

        $innerNFTbutton = '';
        $outterNFTbutton = '';
        if(isset($params['layout']) && $params['layout'] == 'ep-grid' || isset($params['layout-single']) && $params['layout-single'] == 'ep-grid'){
            $outterNFTbutton = $nftbutton;
        }
        else if(isset($params['layout']) && $params['layout'] == 'ep-list' || isset($params['layout-single']) && $params['layout-single'] == 'ep-list'){
            $innerNFTbutton = $nftbutton;
        }
        else{
            $outterNFTbutton = $nftbutton;
        }

        $itemBGColor = $this->createStye('', '', 'itemBGColor');

        $loadmoreStyle = '';
        if(! empty( $params['loadmore'] ) &&  $params['loadmore']  != 'false'){  
            $loadmoreStyle = 'style="display:none"';

            if(!empty($this->getColor('itemBGColor')) && $this->getColor('itemBGColor') != 'true'){
                $loadmoreStyle = 'style="display:none; background-color: ' . $this->getColor('itemBGColor') . ';"';
                $itemBGColor = '';
            }
        }

        $template = '
            <div class="ep_nft_item" '.$itemBGColor.' '.$loadmoreStyle. '>
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
                    '.$innerNFTbutton.'
                </div>
                '.$outterNFTbutton.'
            </div>
        ';

        return $template;
     }

    /**
     * NFT Collection Item template
     */
     public function nftSingleItemTemplate($item, $nft_current_price){

        $params = $this->getParams();

        
        $params = wp_parse_args( $params, [
            'nftimage' => true,
            'nfttitle' => true,
            'nftcreator' => true,
            'nftbutton' => true,
            'nftprice' => true,
            'nftlastsale' => true,
            'collectionname'=> true,
            'nftrank'=> true,
            'nftdetails'=> true,
            'layout' => 'ep-grid',
            'preset' => 'ep-preset-2',
            'prefix_nftcreator' => 'Created By',
            'prefix_nftprice' => 'Current Price',
            'prefix_nftlastsale' => 'Last Sale',
            'label_nftbutton' => 'See Details',
            'label_nftrank' => 'Rank',
            'label_nftdetails' => 'Details',
        ] );

        //Intialize default value
        
        $thumbnail = '';
        $title = '';
        $creator = '';
        $prefix_creator = '';
        $current_price = 0;
        $prefix_current_price = '';
        $last_sale = 0;
        $prefix_last_sale = '';
        $nftbutton = '';
        $label_nftbutton = '';
        $label_nftrank = '';
        $label_nftdetails = '';
        
        $is_verified = '';
        $rank = '';
        $collectionname = '';
        
        $toggle_item = '';
        
        //Template part
        $current_price_template = '';
        $last_sale_price_template = ''; 

        // Assgined current value
        $name = $item['name'] ? $item['name'] : '#'.$item['id'];

        $image_url = $item['image_url'] ? $item['image_url'] : ($item['image_thumbnail_url']?$item['image_thumbnail_url'] : ($item['image_preview_url']?$item['image_preview_url'] : $item['image_original_url']));
        
        
        $img_placeholder = '
            <svg viewBox="0 0 320 330" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H320V330H0V0Z" fill="url(#paint0_linear_16_5)"></path><g opacity="0.15" clip-path="url(#clip0_16_5)"><path d="M136.04 172.213C129.37 172.213 123.436 167.942 121.282 161.584L121.136 161.105C120.628 159.421 120.415 158.005 120.415 156.588V128.178L110.306 161.921C109.006 166.884 111.969 172.029 116.94 173.4L181.371 190.655C182.175 190.864 182.979 190.964 183.771 190.964C187.921 190.964 191.713 188.209 192.775 184.15L196.529 172.213H136.04Z" fill="white"></path><path d="M147.499 128.462C152.095 128.462 155.832 124.724 155.832 120.128C155.832 115.532 152.095 111.795 147.499 111.795C142.903 111.795 139.165 115.532 139.165 120.128C139.165 124.724 142.903 128.462 147.499 128.462Z" fill="white"></path><path opacity="0.5" d="M199.583 99.2943H137.081C131.34 99.2943 126.665 103.97 126.665 109.712V155.546C126.665 161.288 131.34 165.963 137.081 165.963H199.583C205.325 165.963 210 161.288 210 155.546V109.712C210 103.97 205.325 99.2943 199.583 99.2943ZM137.081 107.628H199.583C200.733 107.628 201.666 108.561 201.666 109.712V139.292L188.504 123.932C187.108 122.295 185.087 121.42 182.916 121.37C180.758 121.383 178.733 122.341 177.349 124L161.874 142.575L156.832 137.545C153.982 134.696 149.344 134.696 146.498 137.545L134.998 149.041V109.712C134.998 108.561 135.931 107.628 137.081 107.628Z" fill="white"></path></g><path d="M60.746 217.336H62.798V229H60.746V217.336ZM64.9331 220.036H66.9311V229H64.9331V220.036ZM70.7111 219.838C71.2271 219.838 71.7011 219.91 72.1331 220.054C72.5771 220.198 72.9551 220.42 73.2671 220.72C73.5911 221.008 73.8371 221.368 74.0051 221.8C74.1851 222.232 74.2751 222.742 74.2751 223.33V229H72.2771V223.726C72.2771 222.994 72.0971 222.454 71.7371 222.106C71.3891 221.746 70.8371 221.566 70.0811 221.566C69.5051 221.566 68.9771 221.692 68.4971 221.944C68.0291 222.184 67.6451 222.502 67.3451 222.898C67.0451 223.282 66.8711 223.708 66.8231 224.176L66.8051 223.204C66.8651 222.76 66.9971 222.34 67.2011 221.944C67.4051 221.536 67.6751 221.176 68.0111 220.864C68.3471 220.54 68.7431 220.288 69.1991 220.108C69.6551 219.928 70.1591 219.838 70.7111 219.838ZM77.8571 219.838C78.3851 219.838 78.8651 219.91 79.2971 220.054C79.7291 220.198 80.1011 220.42 80.4131 220.72C80.7371 221.008 80.9891 221.368 81.1691 221.8C81.3491 222.232 81.4391 222.742 81.4391 223.33V229H79.4231V223.726C79.4231 222.994 79.2431 222.454 78.8831 222.106C78.5351 221.746 77.9831 221.566 77.2271 221.566C76.6511 221.566 76.1231 221.692 75.6431 221.944C75.1751 222.184 74.7911 222.502 74.4911 222.898C74.2031 223.282 74.0351 223.708 73.9871 224.176L73.9511 223.168C74.0111 222.736 74.1491 222.322 74.3651 221.926C74.5811 221.518 74.8571 221.158 75.1931 220.846C75.5291 220.534 75.9191 220.288 76.3631 220.108C76.8191 219.928 77.3171 219.838 77.8571 219.838ZM86.9122 229.198C86.0962 229.198 85.3462 229 84.6622 228.604C83.9902 228.208 83.4502 227.662 83.0422 226.966C82.6462 226.258 82.4482 225.448 82.4482 224.536C82.4482 223.6 82.6522 222.784 83.0602 222.088C83.4682 221.38 84.0202 220.828 84.7162 220.432C85.4122 220.036 86.1922 219.838 87.0562 219.838C88.0162 219.838 88.7782 220.048 89.3422 220.468C89.9062 220.888 90.3082 221.452 90.5482 222.16C90.7882 222.868 90.9082 223.66 90.9082 224.536C90.9082 225.028 90.8362 225.55 90.6922 226.102C90.5482 226.642 90.3202 227.146 90.0082 227.614C89.7082 228.082 89.3002 228.466 88.7842 228.766C88.2802 229.054 87.6562 229.198 86.9122 229.198ZM87.5242 227.542C88.1962 227.542 88.7662 227.416 89.2342 227.164C89.7142 226.9 90.0742 226.54 90.3142 226.084C90.5662 225.628 90.6922 225.112 90.6922 224.536C90.6922 223.9 90.5662 223.36 90.3142 222.916C90.0622 222.46 89.7022 222.112 89.2342 221.872C88.7662 221.62 88.1962 221.494 87.5242 221.494C86.5642 221.494 85.8202 221.776 85.2922 222.34C84.7642 222.904 84.5002 223.636 84.5002 224.536C84.5002 225.124 84.6262 225.646 84.8782 226.102C85.1422 226.558 85.5022 226.912 85.9582 227.164C86.4142 227.416 86.9362 227.542 87.5242 227.542ZM90.6922 220.036H92.7082V229H90.8362C90.8362 229 90.8242 228.886 90.8002 228.658C90.7762 228.43 90.7522 228.154 90.7282 227.83C90.7042 227.494 90.6922 227.176 90.6922 226.876V220.036ZM98.1805 227.614C97.3405 227.614 96.5785 227.464 95.8945 227.164C95.2225 226.864 94.6885 226.426 94.2925 225.85C93.9085 225.274 93.7165 224.584 93.7165 223.78C93.7165 222.976 93.9025 222.28 94.2745 221.692C94.6585 221.104 95.1865 220.648 95.8585 220.324C96.5425 220 97.3165 219.838 98.1805 219.838C98.4325 219.838 98.6725 219.856 98.9005 219.892C99.1405 219.928 99.3685 219.976 99.5845 220.036L103.779 220.054V221.728C103.203 221.74 102.621 221.662 102.033 221.494C101.457 221.314 100.947 221.128 100.503 220.936L100.449 220.828C100.857 221.032 101.223 221.284 101.547 221.584C101.883 221.872 102.147 222.202 102.339 222.574C102.531 222.946 102.627 223.366 102.627 223.834C102.627 224.626 102.435 225.304 102.051 225.868C101.679 226.432 101.157 226.864 100.485 227.164C99.8245 227.464 99.0565 227.614 98.1805 227.614ZM101.061 232.654V232.24C101.061 231.652 100.887 231.238 100.539 230.998C100.191 230.758 99.7045 230.638 99.0805 230.638H96.6505C96.1705 230.638 95.7565 230.596 95.4085 230.512C95.0725 230.44 94.8025 230.326 94.5985 230.17C94.3945 230.026 94.2445 229.852 94.1485 229.648C94.0525 229.456 94.0045 229.24 94.0045 229C94.0045 228.52 94.1485 228.16 94.4365 227.92C94.7365 227.68 95.1265 227.524 95.6065 227.452C96.0985 227.38 96.6145 227.368 97.1545 227.416L98.1805 227.614C97.4725 227.638 96.9325 227.704 96.5605 227.812C96.2005 227.908 96.0205 228.106 96.0205 228.406C96.0205 228.586 96.0925 228.73 96.2365 228.838C96.3805 228.946 96.5845 229 96.8485 229H99.4045C100.137 229 100.779 229.084 101.331 229.252C101.883 229.432 102.309 229.726 102.609 230.134C102.921 230.554 103.077 231.124 103.077 231.844V232.654H101.061ZM98.1805 226.048C98.6605 226.048 99.0865 225.958 99.4585 225.778C99.8305 225.598 100.125 225.34 100.341 225.004C100.557 224.668 100.665 224.26 100.665 223.78C100.665 223.3 100.557 222.886 100.341 222.538C100.125 222.19 99.8305 221.926 99.4585 221.746C99.0865 221.566 98.6605 221.476 98.1805 221.476C97.7125 221.476 97.2865 221.566 96.9025 221.746C96.5305 221.926 96.2365 222.19 96.0205 222.538C95.8045 222.874 95.6965 223.288 95.6965 223.78C95.6965 224.26 95.8045 224.668 96.0205 225.004C96.2365 225.34 96.5305 225.598 96.9025 225.778C97.2745 225.958 97.7005 226.048 98.1805 226.048ZM112.044 226.048H113.97C113.874 226.66 113.634 227.206 113.25 227.686C112.878 228.154 112.368 228.526 111.72 228.802C111.072 229.066 110.298 229.198 109.398 229.198C108.378 229.198 107.466 229.012 106.662 228.64C105.858 228.256 105.228 227.716 104.772 227.02C104.316 226.324 104.088 225.496 104.088 224.536C104.088 223.588 104.31 222.76 104.754 222.052C105.198 221.344 105.81 220.798 106.59 220.414C107.382 220.03 108.294 219.838 109.326 219.838C110.394 219.838 111.282 220.03 111.99 220.414C112.71 220.786 113.244 221.35 113.592 222.106C113.94 222.85 114.084 223.792 114.024 224.932H106.122C106.182 225.436 106.344 225.892 106.608 226.3C106.884 226.696 107.256 227.008 107.724 227.236C108.192 227.452 108.738 227.56 109.362 227.56C110.058 227.56 110.64 227.422 111.108 227.146C111.588 226.87 111.9 226.504 112.044 226.048ZM109.272 221.458C108.456 221.458 107.784 221.662 107.256 222.07C106.728 222.466 106.386 222.976 106.23 223.6H112.008C111.96 222.928 111.69 222.406 111.198 222.034C110.706 221.65 110.064 221.458 109.272 221.458ZM129.585 226.876L128.973 227.11V217.336H131.007V229H128.973L120.225 219.514L120.855 219.28V229H118.803V217.336H120.855L129.585 226.876ZM137.576 229.198C136.58 229.198 135.686 229.018 134.894 228.658C134.102 228.298 133.478 227.77 133.022 227.074C132.566 226.378 132.338 225.532 132.338 224.536C132.338 223.552 132.566 222.712 133.022 222.016C133.478 221.308 134.102 220.768 134.894 220.396C135.686 220.024 136.58 219.838 137.576 219.838C138.572 219.838 139.46 220.024 140.24 220.396C141.02 220.768 141.632 221.308 142.076 222.016C142.532 222.712 142.76 223.552 142.76 224.536C142.76 225.532 142.532 226.378 142.076 227.074C141.632 227.77 141.02 228.298 140.24 228.658C139.46 229.018 138.572 229.198 137.576 229.198ZM137.576 227.56C138.152 227.56 138.68 227.446 139.16 227.218C139.64 226.99 140.018 226.648 140.294 226.192C140.582 225.736 140.726 225.184 140.726 224.536C140.726 223.888 140.582 223.336 140.294 222.88C140.018 222.424 139.64 222.076 139.16 221.836C138.692 221.584 138.164 221.458 137.576 221.458C136.988 221.458 136.454 221.578 135.974 221.818C135.494 222.058 135.104 222.406 134.804 222.862C134.516 223.318 134.372 223.876 134.372 224.536C134.372 225.184 134.516 225.736 134.804 226.192C135.092 226.648 135.476 226.99 135.956 227.218C136.448 227.446 136.988 227.56 137.576 227.56ZM143.058 220.036H149.394V221.674H143.058V220.036ZM145.218 217.624H147.234V229H145.218V217.624ZM155.582 226.264V224.518H162.53V226.264H155.582ZM152.882 229L157.976 217.336H160.172L165.302 229H163.088L158.624 218.47H159.524L155.078 229H152.882ZM169.668 227.578H168.966L172.062 220.036H174.24L170.28 229H168.372L164.466 220.036H166.662L169.668 227.578ZM178.607 229.198C177.791 229.198 177.041 229 176.357 228.604C175.685 228.208 175.145 227.662 174.737 226.966C174.341 226.258 174.143 225.448 174.143 224.536C174.143 223.6 174.347 222.784 174.755 222.088C175.163 221.38 175.715 220.828 176.411 220.432C177.107 220.036 177.887 219.838 178.751 219.838C179.711 219.838 180.473 220.048 181.037 220.468C181.601 220.888 182.003 221.452 182.243 222.16C182.483 222.868 182.603 223.66 182.603 224.536C182.603 225.028 182.531 225.55 182.387 226.102C182.243 226.642 182.015 227.146 181.703 227.614C181.403 228.082 180.995 228.466 180.479 228.766C179.975 229.054 179.351 229.198 178.607 229.198ZM179.219 227.542C179.891 227.542 180.461 227.416 180.929 227.164C181.409 226.9 181.769 226.54 182.009 226.084C182.261 225.628 182.387 225.112 182.387 224.536C182.387 223.9 182.261 223.36 182.009 222.916C181.757 222.46 181.397 222.112 180.929 221.872C180.461 221.62 179.891 221.494 179.219 221.494C178.259 221.494 177.515 221.776 176.987 222.34C176.459 222.904 176.195 223.636 176.195 224.536C176.195 225.124 176.321 225.646 176.573 226.102C176.837 226.558 177.197 226.912 177.653 227.164C178.109 227.416 178.631 227.542 179.219 227.542ZM182.387 220.036H184.403V229H182.531C182.531 229 182.519 228.886 182.495 228.658C182.471 228.43 182.447 228.154 182.423 227.83C182.399 227.494 182.387 227.176 182.387 226.876V220.036ZM188.219 216.238V218.164H185.825V216.238H188.219ZM186.005 220.036H188.021V229H186.005V220.036ZM189.874 216.436H191.872V229H189.874V216.436ZM197.576 229.198C196.76 229.198 196.01 229 195.326 228.604C194.654 228.208 194.114 227.662 193.706 226.966C193.31 226.258 193.112 225.448 193.112 224.536C193.112 223.6 193.316 222.784 193.724 222.088C194.132 221.38 194.684 220.828 195.38 220.432C196.076 220.036 196.856 219.838 197.72 219.838C198.68 219.838 199.442 220.048 200.006 220.468C200.57 220.888 200.972 221.452 201.212 222.16C201.452 222.868 201.572 223.66 201.572 224.536C201.572 225.028 201.5 225.55 201.356 226.102C201.212 226.642 200.984 227.146 200.672 227.614C200.372 228.082 199.964 228.466 199.448 228.766C198.944 229.054 198.32 229.198 197.576 229.198ZM198.188 227.542C198.86 227.542 199.43 227.416 199.898 227.164C200.378 226.9 200.738 226.54 200.978 226.084C201.23 225.628 201.356 225.112 201.356 224.536C201.356 223.9 201.23 223.36 200.978 222.916C200.726 222.46 200.366 222.112 199.898 221.872C199.43 221.62 198.86 221.494 198.188 221.494C197.228 221.494 196.484 221.776 195.956 222.34C195.428 222.904 195.164 223.636 195.164 224.536C195.164 225.124 195.29 225.646 195.542 226.102C195.806 226.558 196.166 226.912 196.622 227.164C197.078 227.416 197.6 227.542 198.188 227.542ZM201.356 220.036H203.372V229H201.5C201.5 229 201.488 228.886 201.464 228.658C201.44 228.43 201.416 228.154 201.392 227.83C201.368 227.494 201.356 227.176 201.356 226.876V220.036ZM210.774 229.198C210.03 229.198 209.4 229.054 208.884 228.766C208.38 228.466 207.972 228.082 207.66 227.614C207.36 227.146 207.138 226.642 206.994 226.102C206.862 225.55 206.796 225.028 206.796 224.536C206.796 223.876 206.862 223.264 206.994 222.7C207.126 222.136 207.342 221.644 207.642 221.224C207.954 220.792 208.362 220.456 208.866 220.216C209.382 219.964 210.018 219.838 210.774 219.838C211.638 219.838 212.4 220.036 213.06 220.432C213.732 220.828 214.26 221.38 214.644 222.088C215.04 222.784 215.238 223.6 215.238 224.536C215.238 225.448 215.04 226.258 214.644 226.966C214.248 227.662 213.714 228.208 213.042 228.604C212.37 229 211.614 229.198 210.774 229.198ZM210.162 227.542C210.774 227.542 211.302 227.416 211.746 227.164C212.202 226.912 212.556 226.558 212.808 226.102C213.06 225.646 213.186 225.124 213.186 224.536C213.186 223.636 212.922 222.904 212.394 222.34C211.866 221.764 211.122 221.476 210.162 221.476C209.502 221.476 208.932 221.602 208.452 221.854C207.984 222.106 207.624 222.46 207.372 222.916C207.132 223.36 207.012 223.9 207.012 224.536C207.012 225.112 207.132 225.628 207.372 226.084C207.624 226.54 207.984 226.9 208.452 227.164C208.92 227.416 209.49 227.542 210.162 227.542ZM207.012 216.436V226.876C207.012 227.2 206.994 227.566 206.958 227.974C206.922 228.382 206.886 228.724 206.85 229H204.996V216.436H207.012ZM216.454 216.436H218.452V229H216.454V216.436ZM227.648 226.048H229.574C229.478 226.66 229.238 227.206 228.854 227.686C228.482 228.154 227.972 228.526 227.324 228.802C226.676 229.066 225.902 229.198 225.002 229.198C223.982 229.198 223.07 229.012 222.266 228.64C221.462 228.256 220.832 227.716 220.376 227.02C219.92 226.324 219.692 225.496 219.692 224.536C219.692 223.588 219.914 222.76 220.358 222.052C220.802 221.344 221.414 220.798 222.194 220.414C222.986 220.03 223.898 219.838 224.93 219.838C225.998 219.838 226.886 220.03 227.594 220.414C228.314 220.786 228.848 221.35 229.196 222.106C229.544 222.85 229.688 223.792 229.628 224.932H221.726C221.786 225.436 221.948 225.892 222.212 226.3C222.488 226.696 222.86 227.008 223.328 227.236C223.796 227.452 224.342 227.56 224.966 227.56C225.662 227.56 226.244 227.422 226.712 227.146C227.192 226.87 227.504 226.504 227.648 226.048ZM224.876 221.458C224.06 221.458 223.388 221.662 222.86 222.07C222.332 222.466 221.99 222.976 221.834 223.6H227.612C227.564 222.928 227.294 222.406 226.802 222.034C226.31 221.65 225.668 221.458 224.876 221.458ZM244.936 217.336L240.184 225.202V229H238.132V225.202L233.38 217.336H235.738L239.752 224.212H238.636L242.596 217.336H244.936ZM251.486 226.048H253.412C253.316 226.66 253.076 227.206 252.692 227.686C252.32 228.154 251.81 228.526 251.162 228.802C250.514 229.066 249.74 229.198 248.84 229.198C247.82 229.198 246.908 229.012 246.104 228.64C245.3 228.256 244.67 227.716 244.214 227.02C243.758 226.324 243.53 225.496 243.53 224.536C243.53 223.588 243.752 222.76 244.196 222.052C244.64 221.344 245.252 220.798 246.032 220.414C246.824 220.03 247.736 219.838 248.768 219.838C249.836 219.838 250.724 220.03 251.432 220.414C252.152 220.786 252.686 221.35 253.034 222.106C253.382 222.85 253.526 223.792 253.466 224.932H245.564C245.624 225.436 245.786 225.892 246.05 226.3C246.326 226.696 246.698 227.008 247.166 227.236C247.634 227.452 248.18 227.56 248.804 227.56C249.5 227.56 250.082 227.422 250.55 227.146C251.03 226.87 251.342 226.504 251.486 226.048ZM248.714 221.458C247.898 221.458 247.226 221.662 246.698 222.07C246.17 222.466 245.828 222.976 245.672 223.6H251.45C251.402 222.928 251.132 222.406 250.64 222.034C250.148 221.65 249.506 221.458 248.714 221.458ZM253.757 220.036H260.093V221.674H253.757V220.036ZM255.917 217.624H257.933V229H255.917V217.624Z" fill="white"></path><defs><linearGradient id="paint0_linear_16_5" x1="326.4" y1="1.29268e-05" x2="-63.6095" y2="214.16" gradientUnits="userSpaceOnUse"><stop stop-color="#275EFF"></stop><stop offset="1" stop-color="#A913FF"></stop></linearGradient><clipPath id="clip0_16_5"><rect width="100" height="100" fill="white" transform="translate(110 95)"></rect></clipPath></defs></svg>
        ';

        if(empty($image_url)){
            $img_thumb = $img_placeholder;
        }
        else{
            $img_thumb = '<img
            src="'.esc_url($image_url).'"
            alt="'.esc_attr($name).'">';
        }

        $created_by = isset($item['created_by']) ? $item['created_by'] : '';
        $creator_img_url = isset($item['creator_img_url']) ? $item['creator_img_url'] : '';
        $current_price = isset($item['current_price']) ? $item['current_price'] : 0;
        $usd_price = isset($item['current_price']) && isset($item['usd_price']) ? (float)$item['current_price'] * (float)$item['usd_price'] : 0;

        
        if(isset($item['last_sale']) && !empty($item['last_sale'] && $item['last_sale'] > 0) ){
            $last_sale = $item['last_sale'];
        }

        $last_usd_price = (float) $last_sale * (float) $usd_price;

        $usd_price_tem = '';

        if(!empty($usd_price))
        {
            $usd_price_tem = '<sub class="ep-usd-price" '.$this->createStye('priceUSDColor', 'priceUSDFontsize', '').'>$'.round($usd_price, 2).'</sub>';
        }

        // Checked and assigned prefix text value 
        if(!empty($params['prefix_nftcreator']) && $params['prefix_nftcreator'] != 'false' && $params['prefix_nftcreator'] != 'true'){
            $prefix_creator = $params['prefix_nftcreator'];
        }

        if(!empty($params['prefix_nftprice']) && $params['prefix_nftprice'] != 'false' && $params['prefix_nftprice'] != 'true'){
            $prefix_current_price = $params['prefix_nftprice'];
        } 
        if(!empty($params['prefix_nftlastsale'])  && $params['prefix_nftlastsale'] != 'false' && $params['prefix_nftlastsale'] != 'true'){
            $prefix_last_sale = $params['prefix_nftlastsale'];
        }
        if(!empty($params['label_nftbutton']) && $params['label_nftbutton'] != 'false' && $params['label_nftbutton'] != 'true'){
            $label_nftbutton = $params['label_nftbutton'];
        }

        
        if(!empty($params['label_nftrank']) && $params['label_nftrank'] != 'false' && $params['label_nftrank'] != 'true'){
            $label_nftrank = $params['label_nftrank'];
        }

        if(!empty($params['label_nftdetails']) && $params['label_nftdetails'] != 'false' && $params['label_nftdetails'] != 'true'){
            $label_nftdetails = $params['label_nftdetails'];
        }


        $detail_icon = '<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>details-line</title>
        <path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z" class="clr-i-outline clr-i-outline-path-1"></path><path d="M9,14H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z" class="clr-i-outline clr-i-outline-path-2"></path><path d="M9,18H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z" class="clr-i-outline clr-i-outline-path-3"></path><path d="M9,22H19a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z" class="clr-i-outline clr-i-outline-path-4"></path>
        <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
    </svg>';

    
        $toggleID = 'toggle-'.rand(655, 54654656546);

        if(($params['nftdetails'] == 'yes' || $params['nftdetails'] == 'true') && !empty($params['nftdetails'])){
            $toggle_item = '<div class="ep-container">
            <div class="ep-accordion">
        
                <div class="ep-option">
                    <input type="checkbox" id="'.esc_attr( $toggleID ).'" class="ep-toggle" />
                    <label class="ep-title" for="'.esc_attr( $toggleID ).'" '.$this->createStye('detialTitleColor', 'detialTitleFZ', '').'>'.$detail_icon. esc_html($label_nftdetails).'</label>
                    <div class="ep-content">
                        <div class="ep-asset-details" '.$this->createStye('detailTextColor', 'detailTextFZ', '').'>
                            <div class="ep-asset-detail-item">Contract Address
                                <span>
                                    <a class="sc-1f719d57-0 fKAlPV"
                                        href="'.esc_url('https://etherscan.io/address/'.$item['contract_address']).'" rel="nofollow noopener"
                                        target="_blank" '.$this->createStye('detailTextLinkColor', '', '').'>'.substr($item['contract_address'], 0, 6).'...'.substr($item['contract_address'], -4).'</a>
                                </span>
                            </div>
                            <div class="ep-asset-detail-item">Token ID
                                <span>'.esc_html($item['id']).'</span>
                            </div>
                            <div class="ep-asset-detail-item">Token Standard
                                <span>'.esc_html($item['token_standard']).'</span>
                            </div>
                        </div>
                    </div>
                </div>
        
            </div>
            </div>';
        }

        if($item['verified'] == 'verified'){
            $is_verified = '<sub class="verified-icon"><svg aria-label="verified-icon" class="sc-9c65691d-0 ghqJwW"         fill="#2081e2" viewBox="0 0 30 30"><path d="M13.474 2.80108C14.2729 1.85822 15.7271 1.85822 16.526 2.80108L17.4886 3.9373C17.9785 4.51548 18.753 4.76715 19.4892 4.58733L20.9358 4.23394C22.1363 3.94069 23.3128 4.79547 23.4049 6.0278L23.5158 7.51286C23.5723 8.26854 24.051 8.92742 24.7522 9.21463L26.1303 9.77906C27.2739 10.2474 27.7233 11.6305 27.0734 12.6816L26.2903 13.9482C25.8918 14.5928 25.8918 15.4072 26.2903 16.0518L27.0734 17.3184C27.7233 18.3695 27.2739 19.7526 26.1303 20.2209L24.7522 20.7854C24.051 21.0726 23.5723 21.7315 23.5158 22.4871L23.4049 23.9722C23.3128 25.2045 22.1363 26.0593 20.9358 25.7661L19.4892 25.4127C18.753 25.2328 17.9785 25.4845 17.4886 26.0627L16.526 27.1989C15.7271 28.1418 14.2729 28.1418 13.474 27.1989L12.5114 26.0627C12.0215 25.4845 11.247 25.2328 10.5108 25.4127L9.06418 25.7661C7.86371 26.0593 6.6872 25.2045 6.59513 23.9722L6.48419 22.4871C6.42773 21.7315 5.94903 21.0726 5.24777 20.7854L3.86969 20.2209C2.72612 19.7526 2.27673 18.3695 2.9266 17.3184L3.70973 16.0518C4.10824 15.4072 4.10824 14.5928 3.70973 13.9482L2.9266 12.6816C2.27673 11.6305 2.72612 10.2474 3.86969 9.77906L5.24777 9.21463C5.94903 8.92742 6.42773 8.26854 6.48419 7.51286L6.59513 6.0278C6.6872 4.79547 7.86371 3.94069 9.06418 4.23394L10.5108 4.58733C11.247 4.76715 12.0215 4.51548 12.5114 3.9373L13.474 2.80108Z" class="sc-9c65691d-1 jiZrqV"></path><path d="M13.5 17.625L10.875 15L10 15.875L13.5 19.375L21 11.875L20.125 11L13.5 17.625Z" fill="white" stroke="white"></path></svg></sub>';
        }


        if((!empty($item['rank']) && ($params['nftrank'] == 'yes') || (!empty($item['rank']) && $params['nftrank'] == 'true')) && !empty($params['nftrank'])){
            $emp_class = empty($label_nftrank)? ' ep-empty-label':'';
            $rank = '<div class="ep-nft-rank-wraper'.esc_attr( $emp_class ).'" '.$this->createStye('rankLabelColor', 'rankLabelFZ', '').'>'.esc_html($label_nftrank).' <span class="ep-nft-rank"  target="_blank" '.$this->createStye('rankBtnColor', 'rankBtnFZ', 'rankBtnBorderColor').'>#'.esc_html($item['rank']).'</span></div>';
        }


        if(isset($item['collectionname']) && ($params['collectionname'] == 'yes' || $params['collectionname'] == 'true') && !empty($params['collectionname'])){
            $collectionname = '<a class="CollectionLink--link" target="_blank" href="'.esc_url('https://opensea.io/collection/'.$item['collection_slug']).'" '.$this->createStye('collectionNameColor', 'collectionNameFZ', '').'><span
            class="CollectionLink--name">'.esc_html($item['collectionname']).$is_verified.'</span></a>';
        }

        if(!empty($nft_current_price) &&  (($nft_current_price > 0) && (($params['nftprice'] == 'yes') || ($params['nftprice'] == 'true')))){
            $current_price_template = '
            <div class="ep_nft_price ep_current_price">
                <span class="eb_nft_label" '.$this->createStye('priceLabelColor', 'priceLabelFontsize', '').'>'.esc_html($prefix_current_price).'</span>
                <span class="eb_nft_price" '.$this->createStye('priceColor', 'priceFontsize', '').'>'. esc_html(round($nft_current_price, 4)).' ETH '.$usd_price_tem.'</span>
            </div>
            ';
        }

        if(!empty($last_sale) && (($last_sale > 0) && (($params['nftlastsale'] == 'yes') || ($params['nftlastsale'] == 'true')))){
            $last_sale_price_template = '
            <div class="ep_nft_price ep_nft_last_sale" >
                <span class="eb_nft_label" '.$this->createStye('lastSaleLabelColor', 'lastSaleLabelFontsize', '').'>'.esc_html($prefix_last_sale).'</span>
                <span class="eb_nft_price" '.$this->createStye('lastSaleColor', 'lastSaleFontsize', '').'>'. esc_html(round($last_sale, 4)).' ETH <sub class="ep-usd-price" '.$this->createStye('lastSaleUSDColor', 'lastSaleUSDFontsize', '').'>$'.round($last_usd_price, 2).'</sub></span>
            </div>
            ';
        }

        if(($params['nftimage'] == 'yes') || ($params['nftimage'] == 'true')):
            $thumbnail = '<div class="ep_nft_thumbnail">'.$img_thumb.'</div>';
        endif;

        if((($params['nftcreator'] == 'yes') || ($params['nftcreator'] == 'true')) && !empty($created_by) && !empty($item['creator_url'])):
            $creator = '<div class="ep_nft_owner_wrapper">
                <div class="ep_nft_creator">';
            if(!empty($creator_img_url)) {
                $creator .= '<img src="'.esc_url($creator_img_url).'" alt="'.esc_attr($created_by).'">';
            }
            $creator .= '<span '.$this->createStye('creatorColor', 'creatorFontsize', '').'>'.esc_html($prefix_creator).' <a target="_blank"
                        href="'.esc_url($item['creator_url']).'" '.$this->createStye('creatorLinkColor', 'creatorLinkFontsize', '').'>'.esc_html($created_by).'</a></span>
                </div>
            </div>';
        endif;

        if(($params['nfttitle'] == 'yes') || ($params['nfttitle'] == 'true')):
            $title = ' <h3 class="ep_nft_title" '.$this->createStye('titleColor', 'titleFontsize', '').'>'.esc_html($name).'</h3>';
        endif;

        $detailsbtn = '';
        
        if(($params['nftbutton'] == 'yes') || ($params['nftbutton'] == 'true')):
            $detailsbtn = '<a class="ep-details-btn" target="_blank" href="'.esc_url($item['permalink']).'" '.$this->createStye('buttonTextColor', 'buttonFontSize', 'buttonBackgroundColor').'>'.esc_html($label_nftbutton).'</a>';
        endif;
        
        if(!empty($detailsbtn) || !empty($rank)):
            $nftbutton = '<div class="ep_nft_button"> '.$detailsbtn.' </div>';
        endif;

        $itemBGColor = $this->createStye('', '', 'itemBGColor');

        $template = '
                <div class="ep_nft_item" '.$itemBGColor.'>
                    '.$thumbnail.'
                    <div class="ep_nft_content">
                        '.$collectionname .'
                       '.$title.'
                        <div class="ep_nft_content_body">
                           '.$creator.'
                           '.$rank.'
                            <div class="ep_nft_price_wrapper">
                                '.$current_price_template.'
                                '.$last_sale_price_template.'
                            </div>
                        </div>
                        '.$nftbutton.' 
                        '.$toggle_item.'
                    </div>
                </div>
            ';

        if(empty($item['permalink']) && !(strpos($item['permalink'], '/ethereum/') > 0)){    
            return '<h4 style="text-align: center">Currently, this blockchain is not supported.</h4>';
        }
        
        return $template;

     }

      public function fakeDynamicResponse($html, $params)
    {

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
           
            if(isset($params['gapbetweenitem'])){
                $gap = $params['gapbetweenitem'];
            }
            else{
                $gap = 30;
            }

            if(isset($params['nftperrow'])){
                $itemperrow  = $params['nftperrow'];
            }
            else{
                $itemperrow = 3;
            }

            if(!empty($itemperrow) && (int)$itemperrow > 0 && $itemperrow != 'auto'){
                $nftperrow = 'calc('.(100 / (int) $itemperrow).'% - '.$gap.'px)';
            }
            else{
                $nftperrow = 'auto';
            }

            $uniqid = '.ose-uid-'.md5($this->getUrl());
        ?>

        <style>
            <?php echo esc_html($uniqid); ?> .ep_nft_content_wrap {
                grid-template-columns: repeat(auto-fit, minmax(<?php echo esc_html($nftperrow); ?>, 1fr));
                gap: <?php echo esc_html($gap); ?>px;
            }
        </style>

    <?php
    }

}
