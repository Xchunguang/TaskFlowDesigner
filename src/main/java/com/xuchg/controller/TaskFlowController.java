package com.xuchg.controller;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.xuchg.dto.TaskFlowModel;
import com.xuchg.service.TaskFlowService;
import com.xuchg.window.MainWindow;

/**
 * 任务流接口
 * @author xuchg1
 *
 */
@Component
public class TaskFlowController {


    @Autowired
    private TaskFlowService taskFlowService;

    /**
     * 获得所有任务流
     * @return
     */
    public String getAll(){
        return JSON.toJSONString(taskFlowService.getAllTaskFlow());
    }

    /**
     * 保存任务流
     * @param model
     * @return
     */
    public String save(String modelStr){
    	TaskFlowModel model = JSON.parseObject(modelStr, TaskFlowModel.class);
        return taskFlowService.saveTaskFlow(model);
    }

    /**
     * 获取一个任务流的详细信息
     * @param taskFlowPk
     * @return
     */
    public String find(String taskFlowPk){
    	TaskFlowModel result = taskFlowService.getTaskFlowModel(taskFlowPk);
        return JSON.toJSONString(result);
    }

    /**
     * 删除任务流
     * @param taskFlowPk
     * @return
     */
    public String delete(String taskFlowPk){
        taskFlowService.deleteTaskFlow(taskFlowPk);
        return "success";
    }
    
    /**
     * 退出
     */
    public void closeMainWindow(){
		MainWindow.stage.close();
	}
    
    /**
     * 打开github
     * @throws URISyntaxException
     * @throws IOException
     */
    public void openGithub() throws URISyntaxException, IOException{
    	String url = "https://github.com/Xchunguang";
    	System.setProperty("java.awt.headless", "false");
    	URI address = new URI(url);
    	Desktop d = Desktop.getDesktop();
    	d.browse(address);
    }
}
