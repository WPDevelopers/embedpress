import EmbedWrap
	from "../common/embed-wrap";

export default function RenderEmbedPress (props) {
	const {embedHTML} = props.attributes
	const defaultClass = 'embedpress embedpress-block-front'
	return (
		<EmbedWrap className={defaultClass} dangerouslySetInnerHTML={{
			__html: embedHTML
		}}></EmbedWrap>
	);
}
