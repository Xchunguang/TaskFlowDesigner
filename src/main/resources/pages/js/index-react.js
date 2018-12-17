		      
    const Panel = antd.Collapse.Panel;
    const Option = antd.Select.Option;

    

    class TaskDesign extends React.Component{
        
        constructor(props){
            super(props);
            this.state=({
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
                taskFlowList:[],
                taskFlowListIndex:-1,
                zoom:1.0,
                openMenuIndex:1
            })

            initConnect = this.initList.bind(this); 
        }

        componentWillMount(){
            // this.initTaskFlowList();
        }

        initList=(listStr)=>{
          let list = JSON.parse(listStr);
          if(list.length > 0){
            this.setState({
                taskFlowList:list
            })
          }
          
        }

        initTaskFlowList=()=>{
          let result = taskFlowController.getAll();
          this.initList(result);
        }


        obj={}

        dragObj={}

        doDown = (e) => {
          e.stopPropagation();
          this.obj.drag = true;
          this.obj.oriX = e.clientX;
          this.obj.oriY = e.clientY;
          this.obj.id = e.target.id;
        };

        doUp = () => {
            if (this.obj.drag) {
                this.obj.drag = false;
            }
        };

        doMove = (e) => {
            if(this.obj.drag&&this.obj.drag === true){
                //位移变化也要计算缩放量
                let widthChange = (e.clientX - this.obj.oriX)/this.state.zoom;
                let heightChange = (e.clientY - this.obj.oriY)/this.state.zoom;
                this.obj.oriX = e.clientX;
                this.obj.oriY = e.clientY;

                let index = parseInt(this.obj.id);
                this.state.taskList[index].left = this.state.taskList[index].left + widthChange;
                this.state.taskList[index].top = this.state.taskList[index].top + heightChange;
                this.setState({
                    taskList:this.state.taskList
                })
                
            }

            if(this.dragObj.dragable){
                //位移变化也要计算缩放量
                let widthChange = (e.clientX - this.dragObj.oriX)/this.state.zoom;
                let heightChange = (e.clientY - this.dragObj.oriY)/this.state.zoom;
                this.dragObj.oriX = e.clientX;
                this.dragObj.oriY = e.clientY;

                let top = this.state.dragTop + heightChange/2;
                if(top >= 0){
                    top = 0;
                }  
                let left = this.state.dragLeft + widthChange/2;
                if(left>=0){
                    left = 0;
                }
                this.setState({
                    dragLeft:left,
                    dragTop:top
                })
            }
        }

        chooseBlock=(e)=>{
            e.stopPropagation();
            let index = parseInt(e.target.id);
            this.setState({
                taskList:this.state.taskList,
                selectTaskIndex:index,
                showTaskInfo:true,
                showRelationInfo:false
            })
        }
        chooseLine=(e)=>{
            e.stopPropagation();
            let index = parseInt(e.target.id);
            this.setState({
                selectLineIndex:index,
                showRelationInfo:true,
                showTaskInfo:false
            })
        }

        getAllBlock=()=>{
            let result = [];
            for(let i=0;i<this.state.taskList.length;i++){
                let dom = <g key={i} id={i} onMouseDown={this.doDown} className="taskG" onDoubleClick={this.chooseBlock}><rect id={i} x={this.state.taskList[i].left} y={this.state.taskList[i].top} rx="10" ry="10" width={getLength(this.state.taskList[i].taskName)} height="40" style={{fill:"rgb(115, 161, 191)",stroke:"pink",strokeWidth:this.state.selectTaskIndex===i?3:0}}></rect><text id={i} x={this.state.taskList[i].left + 20} y={this.state.taskList[i].top + 28} className="taskText">{this.state.taskList[i].taskName}</text></g>
                result.push(dom);
            }
            return result;
        }

        addTaskBlock=()=>{
            let taskVO = {
                taskName:'任务'+(this.state.taskList.length+1),
                left:20-this.state.dragLeft,
                top:20-this.state.dragTop,
                taskStatus:'SEND'
            }
            this.state.taskList.push(taskVO);
            this.setState({
                taskList:this.state.taskList
            })
        }

        addConnect=()=>{
            this.setState({
                drawLine:!this.state.drawLine
            })
        }

        drawLineMove=(e)=>{
            if(this.state.drawInfo.move){
                this.state.drawInfo.x2 = e.clientX;
                this.state.drawInfo.y2 = e.clientY - 50;
                this.setState({
                    drawInfo:this.state.drawInfo
                })
            }
        }

        drawUp=()=>{

            let firstTaskBlockIndex = [];
            let lastTaskBlockIndex = [];

            //找到两个块，由于画布缩放，两个点也需要经过缩放
            let x1 = this.state.drawInfo.x1 / this.state.zoom;
            let y1 = this.state.drawInfo.y1 / this.state.zoom;

            let x2 = this.state.drawInfo.x2 / this.state.zoom;
            let y2 = this.state.drawInfo.y2 / this.state.zoom;
            let taskList = this.state.taskList;
            for(let i=0;i<taskList.length;i++){
                if(taskList[i].left+this.state.dragLeft<=x1&&taskList[i].top+this.state.dragTop<=y1&&taskList[i].left+this.state.dragLeft+getLength(taskList[i].taskName)>=x1&&taskList[i].top+this.state.dragTop+40>=y1){
                    firstTaskBlockIndex.push(i);
                }
                if(taskList[i].left+this.state.dragLeft<=x2&&taskList[i].top+this.state.dragTop<=y2&&taskList[i].left+this.state.dragLeft+getLength(taskList[i].taskName)>=x2&&taskList[i].top+this.state.dragTop+40>=y2){
                    lastTaskBlockIndex.push(i);
                }
            }

            if(firstTaskBlockIndex.length>0&&lastTaskBlockIndex.length>0){
                //如果有重叠，则选择第一个
                let firstBlockIndex = firstTaskBlockIndex[0];
                let lastBlockIndex = lastTaskBlockIndex[0];
                let line = {
                    firstBlockIndex:firstBlockIndex,
                    lastBlockIndex:lastBlockIndex,
                    resolveType:'FS',
                    relationType:'ONETOMANY'
                }

                let exist = false;
                for(let i=0;i<this.state.lines.length;i++){
                    if(this.state.lines[i].firstBlockIndex === line.firstBlockIndex&&this.state.lines[i].lastBlockIndex === line.lastBlockIndex){
                        exist = true;
                        break;
                    }
                }

                if(!exist){
                    this.state.lines.push(line);
                }
                
            }
            
            this.state.drawInfo.x1 = 0;
            this.state.drawInfo.y1 = 0;
            this.state.drawInfo.x2 = 0;
            this.state.drawInfo.y2 = 0;
            this.state.drawInfo.move = false;
            this.setState({
                drawInfo:this.state.drawInfo,
                lines:this.state.lines
            })
        }

        getAllLines=()=>{
            //如果找到，则计算两个块的四个边中点
            //得到最近线路画线
            let result = [];
            for(let i=0;i<this.state.lines.length;i++){
                let firstBlock = this.state.taskList[this.state.lines[i].firstBlockIndex];
                let lastBlock = this.state.taskList[this.state.lines[i].lastBlockIndex];
                let firstX1 = firstBlock.left + getLength(firstBlock.taskName)/2;
                let firstY1 = firstBlock.top;

                let firstX2 = firstBlock.left + getLength(firstBlock.taskName);
                let firstY2 = firstBlock.top + 20;

                let firstX3 = firstBlock.left + getLength(firstBlock.taskName)/2;
                let firstY3 = firstBlock.top + 40;

                let firstX4 = firstBlock.left;
                let firstY4 = firstBlock.top + 20;

                let firstBlockPoint = [[firstX1,firstY1],[firstX2,firstY2],[firstX3,firstY3],[firstX4,firstY4]];

                let lastX1 = lastBlock.left + getLength(lastBlock.taskName)/2;
                let lastY1 = lastBlock.top;

                let lastX2 = lastBlock.left + getLength(lastBlock.taskName);
                let lastY2 = lastBlock.top + 20;

                let lastX3 = lastBlock.left + getLength(lastBlock.taskName)/2;
                let lastY3 = lastBlock.top + 40;

                let lastX4 = lastBlock.left;
                let lastY4 = lastBlock.top + 20;

                let lastBlockPoint = [[lastX1,lastY1],[lastX2,lastY2],[lastX3,lastY3],[lastX4,lastY4]];

                let minFirstIndex = 0;
                let minLastIndex = 0;

                let minDistance = getDistance(firstBlockPoint[0][0],firstBlockPoint[0][1],lastBlockPoint[0][0],lastBlockPoint[0][1]);
                //点的顺序为上右下左,并且上下至于上下边画线，左右只与左右边画线
                for(let m=0;m<firstBlockPoint.length;m++){
                    for(let n=0;n<lastBlockPoint.length;n++){
                        if(m===0||m===2){
                            if(n===0||n===2){
                                let curDistance = getDistance(firstBlockPoint[m][0],firstBlockPoint[m][1],lastBlockPoint[n][0],lastBlockPoint[n][1]);
                                if(curDistance<minDistance){
                                    minDistance = curDistance;
                                    minFirstIndex = m;
                                    minLastIndex = n;
                                }
                            }
                        }else{
                            if(n===1||n===3){
                                let curDistance = getDistance(firstBlockPoint[m][0],firstBlockPoint[m][1],lastBlockPoint[n][0],lastBlockPoint[n][1]);
                                if(curDistance<minDistance){
                                    minDistance = curDistance;
                                    minFirstIndex = m;
                                    minLastIndex = n;
                                }
                            }
                        }
                        
                    }
                }

                if(minFirstIndex===0||minFirstIndex===2){//横面
                    let x1 = firstBlockPoint[minFirstIndex][0];
                    let y1 = (firstBlockPoint[minFirstIndex][1]+lastBlockPoint[minLastIndex][1])/2;

                    let x2 =  lastBlockPoint[minLastIndex][0];
                    let y2 = y1;

                    let lineStr = firstBlockPoint[minFirstIndex][0] + "," + firstBlockPoint[minFirstIndex][1] + " " + x1 + "," + y1 + " " + x2 + "," + y2 + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    let dom = <polyline onClick={this.chooseLine} id={i} key={i} points={lineStr} style={{cursor:'pointer',fill:'none',stroke:'black',strokeWidth:2}}/>
                    let directStr = "";
                    if((lastBlockPoint[minLastIndex][1] - firstBlockPoint[minFirstIndex][1]) > 0){
                        directStr = (lastBlockPoint[minLastIndex][0]-arrowSize) + "," + (lastBlockPoint[minLastIndex][1]-arrowSize) + " " + (lastBlockPoint[minLastIndex][0]+arrowSize) + "," + (lastBlockPoint[minLastIndex][1]-arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    }else {
                        directStr = (lastBlockPoint[minLastIndex][0]-arrowSize) + "," + (lastBlockPoint[minLastIndex][1]+arrowSize) + " " + (lastBlockPoint[minLastIndex][0]+arrowSize) + "," + (lastBlockPoint[minLastIndex][1]+arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    }
                    let directDom = <polyline key={(i+10)*(i+10)} onClick={this.chooseLine} id={i} points={directStr} style={{cursor:'pointer',fill:'black',stroke:'black',strokeWidth:2}}/>
                    result.push(directDom);
                    result.push(dom);
                }else{//竖面
                    let x1 = (firstBlockPoint[minFirstIndex][0]+lastBlockPoint[minLastIndex][0])/2;
                    let y1 = firstBlockPoint[minFirstIndex][1];

                    let x2 =  x1;
                    let y2 = lastBlockPoint[minLastIndex][1];

                    let lineStr = firstBlockPoint[minFirstIndex][0] + "," + firstBlockPoint[minFirstIndex][1] + " " + x1 + "," + y1 + " " + x2 + "," + y2 + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    let dom = <polyline onClick={this.chooseLine} id={i} key={i} points={lineStr} style={{cursor:'pointer',fill:'none',stroke:'black',strokeWidth:2}}/>
                    let directStr = "";
                    if((lastBlockPoint[minLastIndex][0] - firstBlockPoint[minFirstIndex][0]) > 0){
                        directStr = (lastBlockPoint[minLastIndex][0]-arrowSize) + "," + (lastBlockPoint[minLastIndex][1]-arrowSize) + " " + (lastBlockPoint[minLastIndex][0]-arrowSize) + "," + (lastBlockPoint[minLastIndex][1]+arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    }else{
                        directStr = (lastBlockPoint[minLastIndex][0]+arrowSize) + "," + (lastBlockPoint[minLastIndex][1]-arrowSize) + " " + (lastBlockPoint[minLastIndex][0]+arrowSize) + "," + (lastBlockPoint[minLastIndex][1]+arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    }
                    let directDom = <polyline key={(i+10)*(i+10)} onClick={this.chooseLine} id={i} points={directStr} style={{cursor:'pointer',fill:'black',stroke:'black',strokeWidth:2}}/>
                    result.push(directDom);
                    result.push(dom);
                }

                
                
            }
            return result;
        }

        drawDown=(e)=>{
            if(e.button === 2){
                this.addConnect();
            }else{
                this.state.drawInfo.x1 = e.clientX;
                this.state.drawInfo.y1 = e.clientY - 50;
                this.state.drawInfo.move = true;
            }
            
        }

        componentDidMount() {
            document.addEventListener('contextmenu', this._handleContextMenu);
        };

        componentWillUnmount() {
          document.removeEventListener('contextmenu', this._handleContextMenu);
        }

        _handleContextMenu=(event)=>{
            event.preventDefault();
        }
        dragUp=()=>{
            this.dragObj.dragable = false;
        }
        dragDown=(e)=>{
            this.dragObj.dragable = true;
            this.dragObj.oriX = e.clientX;
            this.dragObj.oriY = e.clientY;
        }
        clearSelect=()=>{
            this.setState({
                showRelationInfo:false,
                showTaskInfo:false,
                showGlobalMenu:false
            })
        }

        changeTaskName=(e)=>{
            this.state.taskList[this.state.selectTaskIndex].taskName = e.target.value;
            this.setState({
                taskList:this.state.taskList
            })
        }
        changeTaskContent=(e)=>{
            this.state.taskList[this.state.selectTaskIndex].taskContent = e.target.value;
            this.setState({
                taskList:this.state.taskList
            })
        }
        changeTaskTemp=(e)=>{
            
            for(let i=0;i<this.state.taskList.length;i++){
                if(this.state.taskList[i].tempType === e.target.value){
                    antd.message.error("同一个任务流编码不能重复");
                }
            }
        
            this.state.taskList[this.state.selectTaskIndex].tempType = e.target.value;
            this.setState({
                taskList:this.state.taskList
            })
        }
        changeTaskStatus=(value)=>{
            this.state.taskList[this.state.selectTaskIndex].taskStatus = value;
            this.setState({
                taskList:this.state.taskList
            })
        }
        changeLineResolve=(value)=>{
            this.state.lines[this.state.selectLineIndex].resolveType = value;
            this.setState({
                lines:this.state.lines
            })
        }
        changeLineRelation=(value)=>{
            this.state.lines[this.state.selectLineIndex].relationType = value;
            this.setState({
                lines:this.state.lines
            })
        }

        getTaskFlowModel=()=>{
            let taskFlow = {};
            taskFlow.taskFlowPk = this.state.taskFlowPk;
            taskFlow.taskFlowName = this.state.taskFlowName;
            taskFlow.taskTempList = [];
            taskFlow.taskTempRelationList = [];

            let taskFlowObj = JSON.parse(JSON.stringify(this.state));
            delete taskFlowObj.taskFlowList;
            delete taskFlowObj.taskFlowListIndex;
            taskFlow.taskFlowJson = JSON.stringify(taskFlowObj);
            

            for(let i=0;i<this.state.taskList.length;i++){
                let curTask = {
                    taskName:this.state.taskList[i].taskName,
                    taskContent:this.state.taskList[i].taskContent,
                    tempType:this.state.taskList[i].tempType,
                    taskStatus:this.state.taskList[i].taskStatus
                }
                let taskTemplate = {
                    tempType:this.state.taskList[i].tempType,
                    content:JSON.stringify(curTask)
                }
                taskFlow.taskTempList.push(taskTemplate);
            }

            for(let j=0;j<this.state.lines.length;j++){
                let curRelation = {
                    frontTaskType:this.state.taskList[this.state.lines[j].firstBlockIndex].tempType,
                    afterTaskType:this.state.taskList[this.state.lines[j].lastBlockIndex].tempType,
                    resolveType:this.state.lines[j].resolveType,
                    relationType:this.state.lines[j].relationType
                }
                taskFlow.taskTempRelationList.push(curRelation);
            }
            return taskFlow;
        }
        convertToTaskFlow=()=>{
            let taskFlow = this.getTaskFlowModel();
            
            let returnTaskFlowPk = taskFlowController.save(JSON.stringify(taskFlow));
            this.state.taskFlowPk = returnTaskFlowPk;
            this.initTaskFlowList();
            antd.message.success("保存成功");
            
        }

        
        getAllTaskFlowList=()=>{
            let result = [];
            for(let i=0;i<this.state.taskFlowList.length;i++){
                let dom = <div key={i} className={this.state.taskFlowPk === this.state.taskFlowList[i].taskFlowPk?"taskFlowItem activeTaskFlow":"taskFlowItem"} onClick={()=>{this.changeSelectFlow(i)}}><antd.Icon type="book" /> {this.state.taskFlowList[i].taskFlowName}</div>
                result.push(dom);
            }
            return result;
        }
        changeSelectFlow=(value)=>{
            let index = parseInt(value);
            let curObj = JSON.parse(this.state.taskFlowList[index].taskFlowJson);
            this.setState({
                ...curObj,
                taskFlowPk:this.state.taskFlowList[index].taskFlowPk
            })
        }
        createNewTaskFlow=()=>{
            this.setState({
                ...newTaskFlow
            })
            
        }
        
        changeTaskFlowName=(e)=>{
            this.setState({
                taskFlowName:e.target.value
            })
        }
        
        deleteTaskFlow=()=>{
            if(!this.state.taskFlowPk){
                antd.message.info('未保存');
                return;
            }
            let result = taskFlowController.delete(this.state.taskFlowPk);
            if(result === 'success'){
              antd.message.success("删除成功");
              this.initTaskFlowList();
              this.createNewTaskFlow();
            }
            
        }

        deleteLine=()=>{
            let index = this.state.selectLineIndex;
            this.state.lines.splice(index,1);
            this.setState({
                lines:this.state.lines,
                selectLineIndex:-1,
                showRelationInfo:false
            })
        }
        deleteBlock=()=>{
            let index = this.state.selectTaskIndex;
            this.state.taskList.splice(index,1);
            let newLines = [];
            for(let i=0;i<this.state.lines.length;i++){
                if(!(this.state.lines[i].firstBlockIndex === index || this.state.lines[i].lastBlockIndex === index)){
                    newLines.push(this.state.lines[i]);
                }
            }
            
          

            this.setState({
                taskList:this.state.taskList,
                lines:newLines,
                selectTaskIndex:-1,
                selectLineIndex:-1,
                showTaskInfo:false,
                showRelationInfo:false
            })
        }

        changeTaskX=(e)=>{
            
        }
        changeTaskY=(e)=>{
            
        }
        blockTop=()=>{
            this.state.taskList[this.state.selectTaskIndex].top = this.state.taskList[this.state.selectTaskIndex].top-1;
            this.setState({
                taskList:this.state.taskList
            })
        }
        blockBottom=()=>{
            this.state.taskList[this.state.selectTaskIndex].top = this.state.taskList[this.state.selectTaskIndex].top+1;
            this.setState({
                taskList:this.state.taskList
            })
        }
        blockLeft=()=>{
            this.state.taskList[this.state.selectTaskIndex].left = this.state.taskList[this.state.selectTaskIndex].left-1;
            this.setState({
                taskList:this.state.taskList
            })
        }
        blockRight=()=>{
            this.state.taskList[this.state.selectTaskIndex].left = this.state.taskList[this.state.selectTaskIndex].left+1;
            this.setState({
                taskList:this.state.taskList
            })
        }

        changeZoom=(value)=>{
            this.setState({
                zoom:value/10
            })
        }
        closeGlobalMenu=()=>{
            this.setState({
                showGlobalMenu:false,
                openMenuIndex:1
            })
        }
        openGlobalMenu=()=>{
            this.setState({
                showGlobalMenu:true
            })
        }
        changeNewTaskName=(e)=>{
            newTaskFlow.taskFlowName = e.target.value
        }

        searchTaskPosition=()=>{
            if(this.state.taskList.length > 0){
                let minLeft = this.state.taskList[0].left;
                let minTop = this.state.taskList[0].top;
                for(let i=0;i<this.state.taskList.length;i++){
                    if(this.state.taskList[i].left < minLeft){
                        minLeft = this.state.taskList[i].left;
                    }
                    if(this.state.taskList[i].top < minTop){
                        minTop = this.state.taskList[i].top;
                    }
                }

                this.setState({
                    dragLeft:(minLeft-100)*(-1),
                    dragTop:(minTop-100)*(-1)
                })
            }
        }
        render(){
            const marks = {
                1: '',
                5: '',
                10:'',
                15:'',
                20:'',
            };
            let curTaskFlowModel = this.getTaskFlowModel(); 
            return (
                <div className="taskDiv">
                    <div className="taskHeader">
                        <span className="mainMenu" onClick={this.openGlobalMenu}>任务流设计器 <antd.Icon type="caret-down" style={{fontSize:'14px'}}/> </span>
                        <span className="headerTaskFlowName">{this.state.taskFlowName}</span>
                        <div style={{marginRight:'10px',textAlign:'right'}}>
                            <antd.Button style={{marginLeft:'20px'}} onClick={this.addTaskBlock}>添加任务块</antd.Button>
                            <antd.Button style={{marginLeft:'20px'}} onClick={this.addConnect}>添加关联</antd.Button> 
                            <antd.Button style={{marginLeft:'20px'}} onClick={this.convertToTaskFlow}>保存</antd.Button>
                        </div>
                    </div>
                    <div className="taskBody">
                        
                        <div className="taskRight" onMouseUp={this.dragUp}>
                            <svg id="svgCon" onClick={this.clearSelect} className="svgCon" style={{zoom:this.state.zoom,marginLeft:this.state.dragLeft+'px',marginTop:this.state.dragTop+'px'}} onMouseDown={this.dragDown} onContextMenu={this.handleSelect} onMouseMove={this.doMove} onMouseUp={this.doUp} width="50000" height="50000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                {this.getAllBlock()}
                                {this.getAllLines()}
                            </svg>
                            <div className="drawLine" style={{display:this.state.drawLine?'block':'none'}}>
                                <svg onMouseMove={this.drawLineMove} onMouseUp={this.drawUp} onMouseDown={this.drawDown} width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <line x1={this.state.drawInfo.x1} y1={this.state.drawInfo.y1} x2={this.state.drawInfo.x2} y2={this.state.drawInfo.y2} style={{stroke:'rgb(99,99,99)',strokeWidth:2}}/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="infoBox" style={{marginLeft:this.state.showTaskInfo?'0px':'-250px'}}>
                        <div className="infoLine">
                            <span className="titleSpan">任务名称</span>
                            <antd.Input className="infoInput" onChange={this.changeTaskName} value={this.state.selectTaskIndex!==-1&&this.state.taskList[this.state.selectTaskIndex].taskName?this.state.taskList[this.state.selectTaskIndex].taskName:''}/>
                        </div>
                        <div className="infoLine">
                            <span className="titleSpan">任务简介</span>
                            <antd.Input className="infoInput" onChange={this.changeTaskContent} value={this.state.selectTaskIndex!==-1&&this.state.taskList[this.state.selectTaskIndex].taskContent?this.state.taskList[this.state.selectTaskIndex].taskContent:''}/>
                        </div>
                        <div className="infoLine">
                            <span className="titleSpan">模板编码</span>
                            <antd.Input className="infoInput" onChange={this.changeTaskTemp} value={this.state.selectTaskIndex!==-1&&this.state.taskList[this.state.selectTaskIndex].tempType?this.state.taskList[this.state.selectTaskIndex].tempType:''}/>
                        </div>
                        <div className="infoLine">
                            <span className="titleSpan">起始状态</span>
                            <antd.Select value={this.state.selectTaskIndex!==-1&&this.state.taskList[this.state.selectTaskIndex].taskStatus?this.state.taskList[this.state.selectTaskIndex].taskStatus:'SEND'} className="infoInput" onChange={this.changeTaskStatus}>
                                <Option value="SEND">已发送</Option>
                                <Option value="FINISH">已完成</Option>
                                <Option value="START">进行中</Option>
                                <Option value="STOP">已停止</Option>
                                <Option value="NOTBEGINNING">未开始</Option>
                            </antd.Select>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan">positoin-x</span>
                            <antd.Input className="infoInput" onChange={this.changeTaskX} value={this.state.selectTaskIndex!==-1&&this.state.taskList[this.state.selectTaskIndex].left?this.state.taskList[this.state.selectTaskIndex].left:''}/>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan">positoin-y</span>
                            <antd.Input className="infoInput" onChange={this.changeTaskY} value={this.state.selectTaskIndex!==-1&&this.state.taskList[this.state.selectTaskIndex].top?this.state.taskList[this.state.selectTaskIndex].top:''}/>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan">精准移动</span>
                            <antd.Button className="clickBtn" onClick={this.blockTop}>上</antd.Button>
                            <antd.Button className="clickBtn" onClick={this.blockBottom}>下</antd.Button>
                            <antd.Button className="clickBtn" onClick={this.blockLeft}>左</antd.Button>
                            <antd.Button className="clickBtn" onClick={this.blockRight}>右</antd.Button>
                        </div>

                        <div className="infoLine" >
                            <span className="titleSpan"></span>
                            <antd.Button onClick={this.deleteBlock}>删除任务块</antd.Button>    
                        </div>
                    </div>

                    <div className="infoBox" style={{marginLeft:this.state.showRelationInfo?'0px':'-250px'}}>
                        <div className="infoLine">
                            <span className="titleSpan">前置编码</span>
                            <antd.Input className="infoInput" value={this.state.selectLineIndex!==-1&&this.state.taskList[this.state.lines[this.state.selectLineIndex].firstBlockIndex].tempType?this.state.taskList[this.state.lines[this.state.selectLineIndex].firstBlockIndex].tempType:''}/>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan">后置编码</span>
                            <antd.Input className="infoInput" value={this.state.selectLineIndex!==-1&&this.state.taskList[this.state.lines[this.state.selectLineIndex].lastBlockIndex].tempType?this.state.taskList[this.state.lines[this.state.selectLineIndex].lastBlockIndex].tempType:''}/>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan">操作类型</span>
                            <antd.Select value={this.state.selectLineIndex!==-1&&this.state.lines[this.state.selectLineIndex].resolveType?this.state.lines[this.state.selectLineIndex].resolveType:'FS'} className="infoInput" onChange={this.changeLineResolve}>
                                <Option value="FS">前结束后开始</Option>
                                <Option value="FF">前结束后结束</Option>
                                <Option value="SF">前开始后结束</Option>
                                <Option value="SS">前开始后开始</Option>
                            </antd.Select>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan">关联关系</span>
                            <antd.Select value={this.state.selectLineIndex!==-1&&this.state.lines[this.state.selectLineIndex].relationType?this.state.lines[this.state.selectLineIndex].relationType:'ONETOMANY'} className="infoInput" onChange={this.changeLineRelation}>
                                <Option value="ONETOMANY">一对多</Option>
                                <Option value="MANYTOONE">多对一</Option>
                            </antd.Select>
                        </div>

                        <div className="infoLine">
                            <span className="titleSpan"></span>
                            <antd.Button onClick={this.deleteLine}>删除关联线</antd.Button>    
                        </div>

                    </div>

                    <div className="toolBar">
                        <antd.Slider max={20} min={1} vertical  marks={marks} tipFormatter={formatter} value={this.state.zoom*10} onChange={this.changeZoom}/>
                        <antd.Icon type="eye" className="focusTask" onClick={this.searchTaskPosition}/>
                    </div>

                    <div className="globalMenu" style={{marginLeft:this.state.showGlobalMenu?'0px':'-600px'}}>
                        <div className="menuLeft">
                            <div className="closeMenu" onClick={this.closeGlobalMenu}> <antd.Icon type="left-circle" /></div>
                            <div className={this.state.openMenuIndex===0?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:0})}}> 新建</div>
                            <div className={this.state.openMenuIndex===1?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:1})}}> 打开</div>
                            <div className={this.state.openMenuIndex===2?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:2})}}> 修改</div>
                            <div className={this.state.openMenuIndex===3?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:3})}}> 删除</div> 
                            <div className={this.state.openMenuIndex===4?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:4})}}> 查看</div>
                            <div className={this.state.openMenuIndex===5?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:5})}}> 说明</div>
                            <div className={this.state.openMenuIndex===6?"menuItem active":"menuItem"} onClick={()=>{this.setState({openMenuIndex:6})}}> 退出</div>
                        </div>
                        <div className="menuRight">
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===0?'block':'none'}}>
                                <div className="title">新建</div>
                                <div className="otherTitle">新建任务流</div>
                                <div className="inputDiv">
                                    <span className="inputTitle">任务流名称：</span>
                                    <antd.Input className="inputItem" onChange={this.changeNewTaskName}/>
                                    <antd.Button className="itemBtn okBtn" onClick={this.createNewTaskFlow}>确定</antd.Button>
                                    <antd.Button className="itemBtn" onClick={this.closeGlobalMenu}>取消</antd.Button>
                                </div>
                            </div>
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===1?'block':'none'}}>
                                <div className="title">打开</div>
                                <div className="otherTitle">所有任务流</div>
                                {this.getAllTaskFlowList()}
                            </div>
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===2?'block':'none'}}>
                                <div className="title">修改</div>
                                <div className="otherTitle">修改任务流</div>
                                <div className="inputDiv">
                                    <span className="inputTitle">任务流名称：</span>
                                    <antd.Input className="inputItem" value={this.state.taskFlowName} onChange={this.changeTaskFlowName}/>
                                    <antd.Button className="itemBtn okBtn" onClick={this.closeGlobalMenu}>完成</antd.Button>
                                </div>
                            </div>
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===3?'block':'none'}}>
                                <div className="title">删除</div>
                                <div className="otherTitle">是否删除当前任务流？</div>
                                <div className="inputDiv">
                                    <span className="inputTitle">任务流名称：{this.state.taskFlowName}</span>
                                    <antd.Button className="itemBtn okBtn" onClick={this.deleteTaskFlow}>确定</antd.Button>
                                    <antd.Button className="itemBtn" onClick={this.closeGlobalMenu}>取消</antd.Button>
                                </div>
                            </div>
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===4?'block':'none'}}>
                                <div className="title">查看</div>
                                <div className="otherTitle">查看当前任务流配置</div>
                                <div className="inputDiv">
                                    <span className="inputTitle">任务流名称：{this.state.taskFlowName}</span>
                                    <div className="taskFlowDetail">
                                        <p>任务块：</p>
                                        {JSON.stringify(curTaskFlowModel.taskTempList)}    
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>任务关联线：</p>
                                        {JSON.stringify(curTaskFlowModel.taskTempRelationList)}    
                                    </div>
                                </div>
                            </div>
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===5?'block':'none'}}>
                                <div className="title">说明</div>
                                <div className="otherTitle">操作说明</div>
                                <div className="inputDiv">
                                    <div className="taskFlowDetail">
                                        <p>任务块：</p>
                                        双击任务块打开和修改任务的详细信息、起始状态、精准移动和删除该任务块功能。其中模板编码为编号code。
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>关联线：</p>
                                        单击关联线的<span style={{color:'#2196f3'}}>箭头</span>打开关联线面板，可查看前置和后置任务的编码但不可编辑，可选操作类型、关联关系和删除关联线。
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>添加任务块：</p>
                                        单击将添加一个任务块
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>添加关联：</p>
                                        单击即进入关联模式，鼠标左键单击不放链接任意两个任务块，鼠标右键退出关联模式
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>保存：</p>
                                        保存当前任务流，便于下次浏览编辑
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>缩放：</p>
                                        支持缩放，最大0.1~2倍
                                    </div>
                                    <div className="taskFlowDetail">
                                        <p>定位：</p>
                                        点击 <antd.Icon type="eye" style={{cursor:'pointer',fontSize:'18px'}} onClick={this.searchTaskPosition}/> 定位到任务流位置
                                    </div>
                                    <div className="taskFlowDetail" style={{marginTop:'30px',fontSize:'30px'}}>
                                        <a target="_blank" onClick={()=>{taskFlowController.openGithub()}} ><antd.Icon type="github" /></a>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="menuDetail" style={{display:this.state.openMenuIndex===6?'block':'none'}}>
                                <div className="title">退出</div>
                                <div className="otherTitle">是否放弃编辑退出？</div>
                                <div className="inputDiv">
                                    <span className="inputTitle">任务流名称：{this.state.taskFlowName}</span>
                                    <antd.Button className="itemBtn okBtn" onClick={()=>{taskFlowController.closeMainWindow()}}>确定</antd.Button>
                                    <antd.Button className="itemBtn" onClick={this.closeGlobalMenu}>取消</antd.Button>
                                </div>
                            </div>
                        </div>
                    </div>

                

                </div>
            );
        }
    }

    ReactDOM.render(
        <div >
          <TaskDesign></TaskDesign>
        </div>,
        document.getElementById('mainDiv')
    );
    