var initList = function(curInitList){
    initConnect(curInitList);
}

var initConnect = function(list){}

function formatter(value) {
    return `${value/10}`;
}
//关联线的箭头大小
var arrowSize = 8;

/**获得文字的实际width */
var getLength = function(str) {
    var dom = document.createElement("span");
    dom.style.display = "inline-block";
    dom.style.fontSize = "18px";
    dom.innerHTML = str;
    dom.style.opacity=0;
    document.body.append(dom);
    var length = dom.offsetWidth;
    dom.remove();
    return length+40;//文字左右各20px
}  
/**获得两个点的距离 */
var getDistance = function(x1,y1,x2,y2){
    let distance = 0;
    if(x1 - x2 === 0 || y1 - y2 === 0){
        distance = Math.abs(x1-x2) + Math.abs(y1-y2);
    }else{
        distance = Math.sqrt(Math.abs(x1-x2)*Math.abs(x1-x2) + Math.abs(y1-y2)*Math.abs(y1-y2));
    }
    return distance;
}

var taskTemp = {
    taskName:'任务1',
    left:20,//则clientX = 20 - this.state.dragLeft
    top:20,//则clientY = 20 - this.state.dragTop
    taskContent:'',
    tempType:'',
    taskStatus:''
}
var lineTemp = {
    firstBlockIndex:0,
    lastBlockIndex:1,
    frontTaskType:'',
    afterTaskType:'',
    resolveType:'',
    relationType:''
}
var newTaskFlow = {
    taskFlowName:'新建任务流',
    taskFlowPk:'',
    drawLine:false,
    dragLeft:-25000,
    dragTop:-25000,
    drawInfo:{
        x1:0,
        y1:0,
        x2:0,
        y2:0,
        move:false
    },
    taskList:[],
    lines:[],
    showTaskInfo:false,
    showRelationInfo:false,
    showGlobalMenu:false,
    selectTaskIndex:-1,
    selectLineIndex:-1,
    zoom:1.0,
    openMenuIndex:1
}