export default function ControlHeader({classname, headerText}){
    return(
        <h4 className={classname?classname: 'ep-control-header'}>{headerText}</h4>
    )
}