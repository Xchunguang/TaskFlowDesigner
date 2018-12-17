'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Panel = antd.Collapse.Panel;
var Option = antd.Select.Option;

var TaskDesign = function (_React$Component) {
    _inherits(TaskDesign, _React$Component);

    function TaskDesign(props) {
        _classCallCheck(this, TaskDesign);

        var _this = _possibleConstructorReturn(this, (TaskDesign.__proto__ || Object.getPrototypeOf(TaskDesign)).call(this, props));

        _this.initList = function (listStr) {
            var list = JSON.parse(listStr);
            if (list.length > 0) {
                _this.setState({
                    taskFlowList: list
                });
            }
        };

        _this.initTaskFlowList = function () {
            var result = taskFlowController.getAll();
            _this.initList(result);
        };

        _this.obj = {};
        _this.dragObj = {};

        _this.doDown = function (e) {
            e.stopPropagation();
            _this.obj.drag = true;
            _this.obj.oriX = e.clientX;
            _this.obj.oriY = e.clientY;
            _this.obj.id = e.target.id;
        };

        _this.doUp = function () {
            if (_this.obj.drag) {
                _this.obj.drag = false;
            }
        };

        _this.doMove = function (e) {
            if (_this.obj.drag && _this.obj.drag === true) {
                //位移变化也要计算缩放量
                var widthChange = (e.clientX - _this.obj.oriX) / _this.state.zoom;
                var heightChange = (e.clientY - _this.obj.oriY) / _this.state.zoom;
                _this.obj.oriX = e.clientX;
                _this.obj.oriY = e.clientY;

                var index = parseInt(_this.obj.id);
                _this.state.taskList[index].left = _this.state.taskList[index].left + widthChange;
                _this.state.taskList[index].top = _this.state.taskList[index].top + heightChange;
                _this.setState({
                    taskList: _this.state.taskList
                });
            }

            if (_this.dragObj.dragable) {
                //位移变化也要计算缩放量
                var _widthChange = (e.clientX - _this.dragObj.oriX) / _this.state.zoom;
                var _heightChange = (e.clientY - _this.dragObj.oriY) / _this.state.zoom;
                _this.dragObj.oriX = e.clientX;
                _this.dragObj.oriY = e.clientY;

                var top = _this.state.dragTop + _heightChange / 2;
                if (top >= 0) {
                    top = 0;
                }
                var left = _this.state.dragLeft + _widthChange / 2;
                if (left >= 0) {
                    left = 0;
                }
                _this.setState({
                    dragLeft: left,
                    dragTop: top
                });
            }
        };

        _this.chooseBlock = function (e) {
            e.stopPropagation();
            var index = parseInt(e.target.id);
            _this.setState({
                taskList: _this.state.taskList,
                selectTaskIndex: index,
                showTaskInfo: true,
                showRelationInfo: false
            });
        };

        _this.chooseLine = function (e) {
            e.stopPropagation();
            var index = parseInt(e.target.id);
            _this.setState({
                selectLineIndex: index,
                showRelationInfo: true,
                showTaskInfo: false
            });
        };

        _this.getAllBlock = function () {
            var result = [];
            for (var i = 0; i < _this.state.taskList.length; i++) {
                var dom = React.createElement(
                    'g',
                    { key: i, id: i, onMouseDown: _this.doDown, className: 'taskG', onDoubleClick: _this.chooseBlock },
                    React.createElement('rect', { id: i, x: _this.state.taskList[i].left, y: _this.state.taskList[i].top, rx: '10', ry: '10', width: getLength(_this.state.taskList[i].taskName), height: '40', style: { fill: "rgb(115, 161, 191)", stroke: "pink", strokeWidth: _this.state.selectTaskIndex === i ? 3 : 0 } }),
                    React.createElement(
                        'text',
                        { id: i, x: _this.state.taskList[i].left + 20, y: _this.state.taskList[i].top + 28, className: 'taskText' },
                        _this.state.taskList[i].taskName
                    )
                );
                result.push(dom);
            }
            return result;
        };

        _this.addTaskBlock = function () {
            var taskVO = {
                taskName: '任务' + (_this.state.taskList.length + 1),
                left: 20 - _this.state.dragLeft,
                top: 20 - _this.state.dragTop,
                taskStatus: 'SEND'
            };
            _this.state.taskList.push(taskVO);
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.addConnect = function () {
            _this.setState({
                drawLine: !_this.state.drawLine
            });
        };

        _this.drawLineMove = function (e) {
            if (_this.state.drawInfo.move) {
                _this.state.drawInfo.x2 = e.clientX;
                _this.state.drawInfo.y2 = e.clientY - 50;
                _this.setState({
                    drawInfo: _this.state.drawInfo
                });
            }
        };

        _this.drawUp = function () {

            var firstTaskBlockIndex = [];
            var lastTaskBlockIndex = [];

            //找到两个块，由于画布缩放，两个点也需要经过缩放
            var x1 = _this.state.drawInfo.x1 / _this.state.zoom;
            var y1 = _this.state.drawInfo.y1 / _this.state.zoom;

            var x2 = _this.state.drawInfo.x2 / _this.state.zoom;
            var y2 = _this.state.drawInfo.y2 / _this.state.zoom;
            var taskList = _this.state.taskList;
            for (var i = 0; i < taskList.length; i++) {
                if (taskList[i].left + _this.state.dragLeft <= x1 && taskList[i].top + _this.state.dragTop <= y1 && taskList[i].left + _this.state.dragLeft + getLength(taskList[i].taskName) >= x1 && taskList[i].top + _this.state.dragTop + 40 >= y1) {
                    firstTaskBlockIndex.push(i);
                }
                if (taskList[i].left + _this.state.dragLeft <= x2 && taskList[i].top + _this.state.dragTop <= y2 && taskList[i].left + _this.state.dragLeft + getLength(taskList[i].taskName) >= x2 && taskList[i].top + _this.state.dragTop + 40 >= y2) {
                    lastTaskBlockIndex.push(i);
                }
            }

            if (firstTaskBlockIndex.length > 0 && lastTaskBlockIndex.length > 0) {
                //如果有重叠，则选择第一个
                var firstBlockIndex = firstTaskBlockIndex[0];
                var lastBlockIndex = lastTaskBlockIndex[0];
                var line = {
                    firstBlockIndex: firstBlockIndex,
                    lastBlockIndex: lastBlockIndex,
                    resolveType: 'FS',
                    relationType: 'ONETOMANY'
                };

                var exist = false;
                for (var _i = 0; _i < _this.state.lines.length; _i++) {
                    if (_this.state.lines[_i].firstBlockIndex === line.firstBlockIndex && _this.state.lines[_i].lastBlockIndex === line.lastBlockIndex) {
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    _this.state.lines.push(line);
                }
            }

            _this.state.drawInfo.x1 = 0;
            _this.state.drawInfo.y1 = 0;
            _this.state.drawInfo.x2 = 0;
            _this.state.drawInfo.y2 = 0;
            _this.state.drawInfo.move = false;
            _this.setState({
                drawInfo: _this.state.drawInfo,
                lines: _this.state.lines
            });
        };

        _this.getAllLines = function () {
            //如果找到，则计算两个块的四个边中点
            //得到最近线路画线
            var result = [];
            for (var i = 0; i < _this.state.lines.length; i++) {
                var firstBlock = _this.state.taskList[_this.state.lines[i].firstBlockIndex];
                var lastBlock = _this.state.taskList[_this.state.lines[i].lastBlockIndex];
                var firstX1 = firstBlock.left + getLength(firstBlock.taskName) / 2;
                var firstY1 = firstBlock.top;

                var firstX2 = firstBlock.left + getLength(firstBlock.taskName);
                var firstY2 = firstBlock.top + 20;

                var firstX3 = firstBlock.left + getLength(firstBlock.taskName) / 2;
                var firstY3 = firstBlock.top + 40;

                var firstX4 = firstBlock.left;
                var firstY4 = firstBlock.top + 20;

                var firstBlockPoint = [[firstX1, firstY1], [firstX2, firstY2], [firstX3, firstY3], [firstX4, firstY4]];

                var lastX1 = lastBlock.left + getLength(lastBlock.taskName) / 2;
                var lastY1 = lastBlock.top;

                var lastX2 = lastBlock.left + getLength(lastBlock.taskName);
                var lastY2 = lastBlock.top + 20;

                var lastX3 = lastBlock.left + getLength(lastBlock.taskName) / 2;
                var lastY3 = lastBlock.top + 40;

                var lastX4 = lastBlock.left;
                var lastY4 = lastBlock.top + 20;

                var lastBlockPoint = [[lastX1, lastY1], [lastX2, lastY2], [lastX3, lastY3], [lastX4, lastY4]];

                var minFirstIndex = 0;
                var minLastIndex = 0;

                var minDistance = getDistance(firstBlockPoint[0][0], firstBlockPoint[0][1], lastBlockPoint[0][0], lastBlockPoint[0][1]);
                //点的顺序为上右下左,并且上下至于上下边画线，左右只与左右边画线
                for (var m = 0; m < firstBlockPoint.length; m++) {
                    for (var n = 0; n < lastBlockPoint.length; n++) {
                        if (m === 0 || m === 2) {
                            if (n === 0 || n === 2) {
                                var curDistance = getDistance(firstBlockPoint[m][0], firstBlockPoint[m][1], lastBlockPoint[n][0], lastBlockPoint[n][1]);
                                if (curDistance < minDistance) {
                                    minDistance = curDistance;
                                    minFirstIndex = m;
                                    minLastIndex = n;
                                }
                            }
                        } else {
                            if (n === 1 || n === 3) {
                                var _curDistance = getDistance(firstBlockPoint[m][0], firstBlockPoint[m][1], lastBlockPoint[n][0], lastBlockPoint[n][1]);
                                if (_curDistance < minDistance) {
                                    minDistance = _curDistance;
                                    minFirstIndex = m;
                                    minLastIndex = n;
                                }
                            }
                        }
                    }
                }

                if (minFirstIndex === 0 || minFirstIndex === 2) {
                    //横面
                    var x1 = firstBlockPoint[minFirstIndex][0];
                    var y1 = (firstBlockPoint[minFirstIndex][1] + lastBlockPoint[minLastIndex][1]) / 2;

                    var x2 = lastBlockPoint[minLastIndex][0];
                    var y2 = y1;

                    var lineStr = firstBlockPoint[minFirstIndex][0] + "," + firstBlockPoint[minFirstIndex][1] + " " + x1 + "," + y1 + " " + x2 + "," + y2 + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    var dom = React.createElement('polyline', { onClick: _this.chooseLine, id: i, key: i, points: lineStr, style: { cursor: 'pointer', fill: 'none', stroke: 'black', strokeWidth: 2 } });
                    var directStr = "";
                    if (lastBlockPoint[minLastIndex][1] - firstBlockPoint[minFirstIndex][1] > 0) {
                        directStr = lastBlockPoint[minLastIndex][0] - arrowSize + "," + (lastBlockPoint[minLastIndex][1] - arrowSize) + " " + (lastBlockPoint[minLastIndex][0] + arrowSize) + "," + (lastBlockPoint[minLastIndex][1] - arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    } else {
                        directStr = lastBlockPoint[minLastIndex][0] - arrowSize + "," + (lastBlockPoint[minLastIndex][1] + arrowSize) + " " + (lastBlockPoint[minLastIndex][0] + arrowSize) + "," + (lastBlockPoint[minLastIndex][1] + arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    }
                    var directDom = React.createElement('polyline', { key: (i + 10) * (i + 10), onClick: _this.chooseLine, id: i, points: directStr, style: { cursor: 'pointer', fill: 'black', stroke: 'black', strokeWidth: 2 } });
                    result.push(directDom);
                    result.push(dom);
                } else {
                    //竖面
                    var _x = (firstBlockPoint[minFirstIndex][0] + lastBlockPoint[minLastIndex][0]) / 2;
                    var _y = firstBlockPoint[minFirstIndex][1];

                    var _x2 = _x;
                    var _y2 = lastBlockPoint[minLastIndex][1];

                    var _lineStr = firstBlockPoint[minFirstIndex][0] + "," + firstBlockPoint[minFirstIndex][1] + " " + _x + "," + _y + " " + _x2 + "," + _y2 + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    var _dom = React.createElement('polyline', { onClick: _this.chooseLine, id: i, key: i, points: _lineStr, style: { cursor: 'pointer', fill: 'none', stroke: 'black', strokeWidth: 2 } });
                    var _directStr = "";
                    if (lastBlockPoint[minLastIndex][0] - firstBlockPoint[minFirstIndex][0] > 0) {
                        _directStr = lastBlockPoint[minLastIndex][0] - arrowSize + "," + (lastBlockPoint[minLastIndex][1] - arrowSize) + " " + (lastBlockPoint[minLastIndex][0] - arrowSize) + "," + (lastBlockPoint[minLastIndex][1] + arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    } else {
                        _directStr = lastBlockPoint[minLastIndex][0] + arrowSize + "," + (lastBlockPoint[minLastIndex][1] - arrowSize) + " " + (lastBlockPoint[minLastIndex][0] + arrowSize) + "," + (lastBlockPoint[minLastIndex][1] + arrowSize) + " " + lastBlockPoint[minLastIndex][0] + "," + lastBlockPoint[minLastIndex][1];
                    }
                    var _directDom = React.createElement('polyline', { key: (i + 10) * (i + 10), onClick: _this.chooseLine, id: i, points: _directStr, style: { cursor: 'pointer', fill: 'black', stroke: 'black', strokeWidth: 2 } });
                    result.push(_directDom);
                    result.push(_dom);
                }
            }
            return result;
        };

        _this.drawDown = function (e) {
            if (e.button === 2) {
                _this.addConnect();
            } else {
                _this.state.drawInfo.x1 = e.clientX;
                _this.state.drawInfo.y1 = e.clientY - 50;
                _this.state.drawInfo.move = true;
            }
        };

        _this._handleContextMenu = function (event) {
            event.preventDefault();
        };

        _this.dragUp = function () {
            _this.dragObj.dragable = false;
        };

        _this.dragDown = function (e) {
            _this.dragObj.dragable = true;
            _this.dragObj.oriX = e.clientX;
            _this.dragObj.oriY = e.clientY;
        };

        _this.clearSelect = function () {
            _this.setState({
                showRelationInfo: false,
                showTaskInfo: false,
                showGlobalMenu: false
            });
        };

        _this.changeTaskName = function (e) {
            _this.state.taskList[_this.state.selectTaskIndex].taskName = e.target.value;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.changeTaskContent = function (e) {
            _this.state.taskList[_this.state.selectTaskIndex].taskContent = e.target.value;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.changeTaskTemp = function (e) {

            for (var i = 0; i < _this.state.taskList.length; i++) {
                if (_this.state.taskList[i].tempType === e.target.value) {
                    antd.message.error("同一个任务流编码不能重复");
                }
            }

            _this.state.taskList[_this.state.selectTaskIndex].tempType = e.target.value;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.changeTaskStatus = function (value) {
            _this.state.taskList[_this.state.selectTaskIndex].taskStatus = value;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.changeLineResolve = function (value) {
            _this.state.lines[_this.state.selectLineIndex].resolveType = value;
            _this.setState({
                lines: _this.state.lines
            });
        };

        _this.changeLineRelation = function (value) {
            _this.state.lines[_this.state.selectLineIndex].relationType = value;
            _this.setState({
                lines: _this.state.lines
            });
        };

        _this.getTaskFlowModel = function () {
            var taskFlow = {};
            taskFlow.taskFlowPk = _this.state.taskFlowPk;
            taskFlow.taskFlowName = _this.state.taskFlowName;
            taskFlow.taskTempList = [];
            taskFlow.taskTempRelationList = [];

            var taskFlowObj = JSON.parse(JSON.stringify(_this.state));
            delete taskFlowObj.taskFlowList;
            delete taskFlowObj.taskFlowListIndex;
            taskFlow.taskFlowJson = JSON.stringify(taskFlowObj);

            for (var i = 0; i < _this.state.taskList.length; i++) {
                var curTask = {
                    taskName: _this.state.taskList[i].taskName,
                    taskContent: _this.state.taskList[i].taskContent,
                    tempType: _this.state.taskList[i].tempType,
                    taskStatus: _this.state.taskList[i].taskStatus
                };
                var taskTemplate = {
                    tempType: _this.state.taskList[i].tempType,
                    content: JSON.stringify(curTask)
                };
                taskFlow.taskTempList.push(taskTemplate);
            }

            for (var j = 0; j < _this.state.lines.length; j++) {
                var curRelation = {
                    frontTaskType: _this.state.taskList[_this.state.lines[j].firstBlockIndex].tempType,
                    afterTaskType: _this.state.taskList[_this.state.lines[j].lastBlockIndex].tempType,
                    resolveType: _this.state.lines[j].resolveType,
                    relationType: _this.state.lines[j].relationType
                };
                taskFlow.taskTempRelationList.push(curRelation);
            }
            return taskFlow;
        };

        _this.convertToTaskFlow = function () {
            var taskFlow = _this.getTaskFlowModel();

            var returnTaskFlowPk = taskFlowController.save(JSON.stringify(taskFlow));
            _this.state.taskFlowPk = returnTaskFlowPk;
            _this.initTaskFlowList();
            antd.message.success("保存成功");
        };

        _this.getAllTaskFlowList = function () {
            var result = [];

            var _loop = function _loop(i) {
                var dom = React.createElement(
                    'div',
                    { key: i, className: _this.state.taskFlowPk === _this.state.taskFlowList[i].taskFlowPk ? "taskFlowItem activeTaskFlow" : "taskFlowItem", onClick: function onClick() {
                            _this.changeSelectFlow(i);
                        } },
                    React.createElement(antd.Icon, { type: 'book' }),
                    ' ',
                    _this.state.taskFlowList[i].taskFlowName
                );
                result.push(dom);
            };

            for (var i = 0; i < _this.state.taskFlowList.length; i++) {
                _loop(i);
            }
            return result;
        };

        _this.changeSelectFlow = function (value) {
            var index = parseInt(value);
            var curObj = JSON.parse(_this.state.taskFlowList[index].taskFlowJson);
            _this.setState(_extends({}, curObj, {
                taskFlowPk: _this.state.taskFlowList[index].taskFlowPk
            }));
        };

        _this.createNewTaskFlow = function () {
            _this.setState(_extends({}, newTaskFlow));
        };

        _this.changeTaskFlowName = function (e) {
            _this.setState({
                taskFlowName: e.target.value
            });
        };

        _this.deleteTaskFlow = function () {
            if (!_this.state.taskFlowPk) {
                antd.message.info('未保存');
                return;
            }
            var result = taskFlowController.delete(_this.state.taskFlowPk);
            if (result === 'success') {
                antd.message.success("删除成功");
                _this.initTaskFlowList();
                _this.createNewTaskFlow();
            }
        };

        _this.deleteLine = function () {
            var index = _this.state.selectLineIndex;
            _this.state.lines.splice(index, 1);
            _this.setState({
                lines: _this.state.lines,
                selectLineIndex: -1,
                showRelationInfo: false
            });
        };

        _this.deleteBlock = function () {
            var index = _this.state.selectTaskIndex;
            _this.state.taskList.splice(index, 1);
            var newLines = [];
            for (var i = 0; i < _this.state.lines.length; i++) {
                if (!(_this.state.lines[i].firstBlockIndex === index || _this.state.lines[i].lastBlockIndex === index)) {
                    newLines.push(_this.state.lines[i]);
                }
            }

            _this.setState({
                taskList: _this.state.taskList,
                lines: newLines,
                selectTaskIndex: -1,
                selectLineIndex: -1,
                showTaskInfo: false,
                showRelationInfo: false
            });
        };

        _this.changeTaskX = function (e) {};

        _this.changeTaskY = function (e) {};

        _this.blockTop = function () {
            _this.state.taskList[_this.state.selectTaskIndex].top = _this.state.taskList[_this.state.selectTaskIndex].top - 1;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.blockBottom = function () {
            _this.state.taskList[_this.state.selectTaskIndex].top = _this.state.taskList[_this.state.selectTaskIndex].top + 1;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.blockLeft = function () {
            _this.state.taskList[_this.state.selectTaskIndex].left = _this.state.taskList[_this.state.selectTaskIndex].left - 1;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.blockRight = function () {
            _this.state.taskList[_this.state.selectTaskIndex].left = _this.state.taskList[_this.state.selectTaskIndex].left + 1;
            _this.setState({
                taskList: _this.state.taskList
            });
        };

        _this.changeZoom = function (value) {
            _this.setState({
                zoom: value / 10
            });
        };

        _this.closeGlobalMenu = function () {
            _this.setState({
                showGlobalMenu: false,
                openMenuIndex: 1
            });
        };

        _this.openGlobalMenu = function () {
            _this.setState({
                showGlobalMenu: true
            });
        };

        _this.changeNewTaskName = function (e) {
            newTaskFlow.taskFlowName = e.target.value;
        };

        _this.searchTaskPosition = function () {
            if (_this.state.taskList.length > 0) {
                var minLeft = _this.state.taskList[0].left;
                var minTop = _this.state.taskList[0].top;
                for (var i = 0; i < _this.state.taskList.length; i++) {
                    if (_this.state.taskList[i].left < minLeft) {
                        minLeft = _this.state.taskList[i].left;
                    }
                    if (_this.state.taskList[i].top < minTop) {
                        minTop = _this.state.taskList[i].top;
                    }
                }

                _this.setState({
                    dragLeft: (minLeft - 100) * -1,
                    dragTop: (minTop - 100) * -1
                });
            }
        };

        _this.state = {
            taskFlowName: '新建任务流',
            taskFlowPk: '',
            drawLine: false,
            dragLeft: -25000,
            dragTop: -25000,
            drawInfo: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0,
                move: false
            },
            taskList: [],
            lines: [],
            showTaskInfo: false,
            showRelationInfo: false,
            showGlobalMenu: false,
            selectTaskIndex: -1,
            selectLineIndex: -1,
            taskFlowList: [],
            taskFlowListIndex: -1,
            zoom: 1.0,
            openMenuIndex: 1
        };

        initConnect = _this.initList.bind(_this);
        return _this;
    }

    _createClass(TaskDesign, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            // this.initTaskFlowList();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.addEventListener('contextmenu', this._handleContextMenu);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            document.removeEventListener('contextmenu', this._handleContextMenu);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var marks = {
                1: '',
                5: '',
                10: '',
                15: '',
                20: ''
            };
            var curTaskFlowModel = this.getTaskFlowModel();
            return React.createElement(
                'div',
                { className: 'taskDiv' },
                React.createElement(
                    'div',
                    { className: 'taskHeader' },
                    React.createElement(
                        'span',
                        { className: 'mainMenu', onClick: this.openGlobalMenu },
                        '\u4EFB\u52A1\u6D41\u8BBE\u8BA1\u5668 ',
                        React.createElement(antd.Icon, { type: 'caret-down', style: { fontSize: '14px' } }),
                        ' '
                    ),
                    React.createElement(
                        'span',
                        { className: 'headerTaskFlowName' },
                        this.state.taskFlowName
                    ),
                    React.createElement(
                        'div',
                        { style: { marginRight: '10px', textAlign: 'right' } },
                        React.createElement(
                            antd.Button,
                            { style: { marginLeft: '20px' }, onClick: this.addTaskBlock },
                            '\u6DFB\u52A0\u4EFB\u52A1\u5757'
                        ),
                        React.createElement(
                            antd.Button,
                            { style: { marginLeft: '20px' }, onClick: this.addConnect },
                            '\u6DFB\u52A0\u5173\u8054'
                        ),
                        React.createElement(
                            antd.Button,
                            { style: { marginLeft: '20px' }, onClick: this.convertToTaskFlow },
                            '\u4FDD\u5B58'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'taskBody' },
                    React.createElement(
                        'div',
                        { className: 'taskRight', onMouseUp: this.dragUp },
                        React.createElement(
                            'svg',
                            { id: 'svgCon', onClick: this.clearSelect, className: 'svgCon', style: { zoom: this.state.zoom, marginLeft: this.state.dragLeft + 'px', marginTop: this.state.dragTop + 'px' }, onMouseDown: this.dragDown, onContextMenu: this.handleSelect, onMouseMove: this.doMove, onMouseUp: this.doUp, width: '50000', height: '50000', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink' },
                            this.getAllBlock(),
                            this.getAllLines()
                        ),
                        React.createElement(
                            'div',
                            { className: 'drawLine', style: { display: this.state.drawLine ? 'block' : 'none' } },
                            React.createElement(
                                'svg',
                                { onMouseMove: this.drawLineMove, onMouseUp: this.drawUp, onMouseDown: this.drawDown, width: '100%', height: '100%', version: '1.1', xmlns: 'http://www.w3.org/2000/svg', xmlnsXlink: 'http://www.w3.org/1999/xlink' },
                                React.createElement('line', { x1: this.state.drawInfo.x1, y1: this.state.drawInfo.y1, x2: this.state.drawInfo.x2, y2: this.state.drawInfo.y2, style: { stroke: 'rgb(99,99,99)', strokeWidth: 2 } })
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'infoBox', style: { marginLeft: this.state.showTaskInfo ? '0px' : '-250px' } },
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u4EFB\u52A1\u540D\u79F0'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', onChange: this.changeTaskName, value: this.state.selectTaskIndex !== -1 && this.state.taskList[this.state.selectTaskIndex].taskName ? this.state.taskList[this.state.selectTaskIndex].taskName : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u4EFB\u52A1\u7B80\u4ECB'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', onChange: this.changeTaskContent, value: this.state.selectTaskIndex !== -1 && this.state.taskList[this.state.selectTaskIndex].taskContent ? this.state.taskList[this.state.selectTaskIndex].taskContent : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u6A21\u677F\u7F16\u7801'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', onChange: this.changeTaskTemp, value: this.state.selectTaskIndex !== -1 && this.state.taskList[this.state.selectTaskIndex].tempType ? this.state.taskList[this.state.selectTaskIndex].tempType : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u8D77\u59CB\u72B6\u6001'
                        ),
                        React.createElement(
                            antd.Select,
                            { value: this.state.selectTaskIndex !== -1 && this.state.taskList[this.state.selectTaskIndex].taskStatus ? this.state.taskList[this.state.selectTaskIndex].taskStatus : 'SEND', className: 'infoInput', onChange: this.changeTaskStatus },
                            React.createElement(
                                Option,
                                { value: 'SEND' },
                                '\u5DF2\u53D1\u9001'
                            ),
                            React.createElement(
                                Option,
                                { value: 'FINISH' },
                                '\u5DF2\u5B8C\u6210'
                            ),
                            React.createElement(
                                Option,
                                { value: 'START' },
                                '\u8FDB\u884C\u4E2D'
                            ),
                            React.createElement(
                                Option,
                                { value: 'STOP' },
                                '\u5DF2\u505C\u6B62'
                            ),
                            React.createElement(
                                Option,
                                { value: 'NOTBEGINNING' },
                                '\u672A\u5F00\u59CB'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            'positoin-x'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', onChange: this.changeTaskX, value: this.state.selectTaskIndex !== -1 && this.state.taskList[this.state.selectTaskIndex].left ? this.state.taskList[this.state.selectTaskIndex].left : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            'positoin-y'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', onChange: this.changeTaskY, value: this.state.selectTaskIndex !== -1 && this.state.taskList[this.state.selectTaskIndex].top ? this.state.taskList[this.state.selectTaskIndex].top : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u7CBE\u51C6\u79FB\u52A8'
                        ),
                        React.createElement(
                            antd.Button,
                            { className: 'clickBtn', onClick: this.blockTop },
                            '\u4E0A'
                        ),
                        React.createElement(
                            antd.Button,
                            { className: 'clickBtn', onClick: this.blockBottom },
                            '\u4E0B'
                        ),
                        React.createElement(
                            antd.Button,
                            { className: 'clickBtn', onClick: this.blockLeft },
                            '\u5DE6'
                        ),
                        React.createElement(
                            antd.Button,
                            { className: 'clickBtn', onClick: this.blockRight },
                            '\u53F3'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement('span', { className: 'titleSpan' }),
                        React.createElement(
                            antd.Button,
                            { onClick: this.deleteBlock },
                            '\u5220\u9664\u4EFB\u52A1\u5757'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'infoBox', style: { marginLeft: this.state.showRelationInfo ? '0px' : '-250px' } },
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u524D\u7F6E\u7F16\u7801'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', value: this.state.selectLineIndex !== -1 && this.state.taskList[this.state.lines[this.state.selectLineIndex].firstBlockIndex].tempType ? this.state.taskList[this.state.lines[this.state.selectLineIndex].firstBlockIndex].tempType : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u540E\u7F6E\u7F16\u7801'
                        ),
                        React.createElement(antd.Input, { className: 'infoInput', value: this.state.selectLineIndex !== -1 && this.state.taskList[this.state.lines[this.state.selectLineIndex].lastBlockIndex].tempType ? this.state.taskList[this.state.lines[this.state.selectLineIndex].lastBlockIndex].tempType : '' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u64CD\u4F5C\u7C7B\u578B'
                        ),
                        React.createElement(
                            antd.Select,
                            { value: this.state.selectLineIndex !== -1 && this.state.lines[this.state.selectLineIndex].resolveType ? this.state.lines[this.state.selectLineIndex].resolveType : 'FS', className: 'infoInput', onChange: this.changeLineResolve },
                            React.createElement(
                                Option,
                                { value: 'FS' },
                                '\u524D\u7ED3\u675F\u540E\u5F00\u59CB'
                            ),
                            React.createElement(
                                Option,
                                { value: 'FF' },
                                '\u524D\u7ED3\u675F\u540E\u7ED3\u675F'
                            ),
                            React.createElement(
                                Option,
                                { value: 'SF' },
                                '\u524D\u5F00\u59CB\u540E\u7ED3\u675F'
                            ),
                            React.createElement(
                                Option,
                                { value: 'SS' },
                                '\u524D\u5F00\u59CB\u540E\u5F00\u59CB'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement(
                            'span',
                            { className: 'titleSpan' },
                            '\u5173\u8054\u5173\u7CFB'
                        ),
                        React.createElement(
                            antd.Select,
                            { value: this.state.selectLineIndex !== -1 && this.state.lines[this.state.selectLineIndex].relationType ? this.state.lines[this.state.selectLineIndex].relationType : 'ONETOMANY', className: 'infoInput', onChange: this.changeLineRelation },
                            React.createElement(
                                Option,
                                { value: 'ONETOMANY' },
                                '\u4E00\u5BF9\u591A'
                            ),
                            React.createElement(
                                Option,
                                { value: 'MANYTOONE' },
                                '\u591A\u5BF9\u4E00'
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'infoLine' },
                        React.createElement('span', { className: 'titleSpan' }),
                        React.createElement(
                            antd.Button,
                            { onClick: this.deleteLine },
                            '\u5220\u9664\u5173\u8054\u7EBF'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'toolBar' },
                    React.createElement(antd.Slider, { max: 20, min: 1, vertical: true, marks: marks, tipFormatter: formatter, value: this.state.zoom * 10, onChange: this.changeZoom }),
                    React.createElement(antd.Icon, { type: 'eye', className: 'focusTask', onClick: this.searchTaskPosition })
                ),
                React.createElement(
                    'div',
                    { className: 'globalMenu', style: { marginLeft: this.state.showGlobalMenu ? '0px' : '-600px' } },
                    React.createElement(
                        'div',
                        { className: 'menuLeft' },
                        React.createElement(
                            'div',
                            { className: 'closeMenu', onClick: this.closeGlobalMenu },
                            ' ',
                            React.createElement(antd.Icon, { type: 'left-circle' })
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 0 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 0 });
                                } },
                            ' \u65B0\u5EFA'
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 1 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 1 });
                                } },
                            ' \u6253\u5F00'
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 2 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 2 });
                                } },
                            ' \u4FEE\u6539'
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 3 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 3 });
                                } },
                            ' \u5220\u9664'
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 4 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 4 });
                                } },
                            ' \u67E5\u770B'
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 5 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 5 });
                                } },
                            ' \u8BF4\u660E'
                        ),
                        React.createElement(
                            'div',
                            { className: this.state.openMenuIndex === 6 ? "menuItem active" : "menuItem", onClick: function onClick() {
                                    _this2.setState({ openMenuIndex: 6 });
                                } },
                            ' \u9000\u51FA'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'menuRight' },
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 0 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u65B0\u5EFA'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u65B0\u5EFA\u4EFB\u52A1\u6D41'
                            ),
                            React.createElement(
                                'div',
                                { className: 'inputDiv' },
                                React.createElement(
                                    'span',
                                    { className: 'inputTitle' },
                                    '\u4EFB\u52A1\u6D41\u540D\u79F0\uFF1A'
                                ),
                                React.createElement(antd.Input, { className: 'inputItem', onChange: this.changeNewTaskName }),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn okBtn', onClick: this.createNewTaskFlow },
                                    '\u786E\u5B9A'
                                ),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn', onClick: this.closeGlobalMenu },
                                    '\u53D6\u6D88'
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 1 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u6253\u5F00'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u6240\u6709\u4EFB\u52A1\u6D41'
                            ),
                            this.getAllTaskFlowList()
                        ),
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 2 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u4FEE\u6539'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u4FEE\u6539\u4EFB\u52A1\u6D41'
                            ),
                            React.createElement(
                                'div',
                                { className: 'inputDiv' },
                                React.createElement(
                                    'span',
                                    { className: 'inputTitle' },
                                    '\u4EFB\u52A1\u6D41\u540D\u79F0\uFF1A'
                                ),
                                React.createElement(antd.Input, { className: 'inputItem', value: this.state.taskFlowName, onChange: this.changeTaskFlowName }),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn okBtn', onClick: this.closeGlobalMenu },
                                    '\u5B8C\u6210'
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 3 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u5220\u9664'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u662F\u5426\u5220\u9664\u5F53\u524D\u4EFB\u52A1\u6D41\uFF1F'
                            ),
                            React.createElement(
                                'div',
                                { className: 'inputDiv' },
                                React.createElement(
                                    'span',
                                    { className: 'inputTitle' },
                                    '\u4EFB\u52A1\u6D41\u540D\u79F0\uFF1A',
                                    this.state.taskFlowName
                                ),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn okBtn', onClick: this.deleteTaskFlow },
                                    '\u786E\u5B9A'
                                ),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn', onClick: this.closeGlobalMenu },
                                    '\u53D6\u6D88'
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 4 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u67E5\u770B'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u67E5\u770B\u5F53\u524D\u4EFB\u52A1\u6D41\u914D\u7F6E'
                            ),
                            React.createElement(
                                'div',
                                { className: 'inputDiv' },
                                React.createElement(
                                    'span',
                                    { className: 'inputTitle' },
                                    '\u4EFB\u52A1\u6D41\u540D\u79F0\uFF1A',
                                    this.state.taskFlowName
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u4EFB\u52A1\u5757\uFF1A'
                                    ),
                                    JSON.stringify(curTaskFlowModel.taskTempList)
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u4EFB\u52A1\u5173\u8054\u7EBF\uFF1A'
                                    ),
                                    JSON.stringify(curTaskFlowModel.taskTempRelationList)
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 5 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u8BF4\u660E'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u64CD\u4F5C\u8BF4\u660E'
                            ),
                            React.createElement(
                                'div',
                                { className: 'inputDiv' },
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u4EFB\u52A1\u5757\uFF1A'
                                    ),
                                    '\u53CC\u51FB\u4EFB\u52A1\u5757\u6253\u5F00\u548C\u4FEE\u6539\u4EFB\u52A1\u7684\u8BE6\u7EC6\u4FE1\u606F\u3001\u8D77\u59CB\u72B6\u6001\u3001\u7CBE\u51C6\u79FB\u52A8\u548C\u5220\u9664\u8BE5\u4EFB\u52A1\u5757\u529F\u80FD\u3002\u5176\u4E2D\u6A21\u677F\u7F16\u7801\u4E3A\u7F16\u53F7code\u3002'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u5173\u8054\u7EBF\uFF1A'
                                    ),
                                    '\u5355\u51FB\u5173\u8054\u7EBF\u7684',
                                    React.createElement(
                                        'span',
                                        { style: { color: '#2196f3' } },
                                        '\u7BAD\u5934'
                                    ),
                                    '\u6253\u5F00\u5173\u8054\u7EBF\u9762\u677F\uFF0C\u53EF\u67E5\u770B\u524D\u7F6E\u548C\u540E\u7F6E\u4EFB\u52A1\u7684\u7F16\u7801\u4F46\u4E0D\u53EF\u7F16\u8F91\uFF0C\u53EF\u9009\u64CD\u4F5C\u7C7B\u578B\u3001\u5173\u8054\u5173\u7CFB\u548C\u5220\u9664\u5173\u8054\u7EBF\u3002'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u6DFB\u52A0\u4EFB\u52A1\u5757\uFF1A'
                                    ),
                                    '\u5355\u51FB\u5C06\u6DFB\u52A0\u4E00\u4E2A\u4EFB\u52A1\u5757'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u6DFB\u52A0\u5173\u8054\uFF1A'
                                    ),
                                    '\u5355\u51FB\u5373\u8FDB\u5165\u5173\u8054\u6A21\u5F0F\uFF0C\u9F20\u6807\u5DE6\u952E\u5355\u51FB\u4E0D\u653E\u94FE\u63A5\u4EFB\u610F\u4E24\u4E2A\u4EFB\u52A1\u5757\uFF0C\u9F20\u6807\u53F3\u952E\u9000\u51FA\u5173\u8054\u6A21\u5F0F'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u4FDD\u5B58\uFF1A'
                                    ),
                                    '\u4FDD\u5B58\u5F53\u524D\u4EFB\u52A1\u6D41\uFF0C\u4FBF\u4E8E\u4E0B\u6B21\u6D4F\u89C8\u7F16\u8F91'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u7F29\u653E\uFF1A'
                                    ),
                                    '\u652F\u6301\u7F29\u653E\uFF0C\u6700\u59270.1~2\u500D'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail' },
                                    React.createElement(
                                        'p',
                                        null,
                                        '\u5B9A\u4F4D\uFF1A'
                                    ),
                                    '\u70B9\u51FB ',
                                    React.createElement(antd.Icon, { type: 'eye', style: { cursor: 'pointer', fontSize: '18px' }, onClick: this.searchTaskPosition }),
                                    ' \u5B9A\u4F4D\u5230\u4EFB\u52A1\u6D41\u4F4D\u7F6E'
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'taskFlowDetail', style: { marginTop: '30px', fontSize: '30px' } },
                                    React.createElement(
                                        'a',
                                        { target: '_blank', onClick: function onClick() {
                                                taskFlowController.openGithub();
                                            } },
                                        React.createElement(antd.Icon, { type: 'github' })
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'menuDetail', style: { display: this.state.openMenuIndex === 6 ? 'block' : 'none' } },
                            React.createElement(
                                'div',
                                { className: 'title' },
                                '\u9000\u51FA'
                            ),
                            React.createElement(
                                'div',
                                { className: 'otherTitle' },
                                '\u662F\u5426\u653E\u5F03\u7F16\u8F91\u9000\u51FA\uFF1F'
                            ),
                            React.createElement(
                                'div',
                                { className: 'inputDiv' },
                                React.createElement(
                                    'span',
                                    { className: 'inputTitle' },
                                    '\u4EFB\u52A1\u6D41\u540D\u79F0\uFF1A',
                                    this.state.taskFlowName
                                ),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn okBtn', onClick: function onClick() {
                                            taskFlowController.closeMainWindow();
                                        } },
                                    '\u786E\u5B9A'
                                ),
                                React.createElement(
                                    antd.Button,
                                    { className: 'itemBtn', onClick: this.closeGlobalMenu },
                                    '\u53D6\u6D88'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return TaskDesign;
}(React.Component);

ReactDOM.render(React.createElement(
    'div',
    null,
    React.createElement(TaskDesign, null)
), document.getElementById('mainDiv'));