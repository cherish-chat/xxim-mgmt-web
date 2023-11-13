/* eslint-disable */
/*富文本编辑图片上传配置*/
import Vue from "vue";
import { Quill } from 'vue-quill-editor'

import { ImageDrop } from 'quill-image-drop-module'
import {ImageResize} from 'quill-image-resize-module'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
import {upload } from '@/api/wt/system'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
const uploadConfig = {
    action:  process.env.VUE_APP_API_BASE_URL + 'admin/upload',  // 必填参数 图片上传地址
    methods: 'POST',  // 必填参数 图片上传方式
    // token: Vue.ls.get(ACCESS_TOKEN),  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'file',  // 必填参数 文件的参数名
    size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{'direction': 'rtl'}],
    [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['link', 'image', 'video'],
    ['sourceEditor']
];
const handlers = {
    image: function image() {
        var self = this;

        var fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name);
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept);
            fileInput.classList.add('ql-image');
            // 监听选择文件
            fileInput.addEventListener('change', function () {
                // 创建formData
                var formData = new FormData();
                formData.append("file", fileInput.files[0]);
              upload(formData).then((res) => {
                let length = self.quill.getSelection(true).index;
                //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
                self.quill.insertEmbed(length, 'image', res.data.url);
                self.quill.setSelection(length + 1)
                fileInput.value = ''
              }).catch((error) => {
                fileInput.value = ''
                Message.error('上传失败')
              })

            });
            this.container.appendChild(fileInput);
        }
        fileInput.click();
    },
    shadeBox:null,
    sourceEditor: function(){
        const reg = /\<br\>/g,
            container = this.container,
            firstChild = container.nextElementSibling.firstChild;
        if(!this.shadeBox){
            let shadeBox = this.shadeBox = document.createElement('div');
            shadeBox.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); cursor:pointer';
            container.style.position  = 'relative';
            shadeBox.addEventListener('click',function(){
                this.style.display = 'none';
                firstChild.innerHTML = firstChild.innerText.trim();
            },false);
            container.appendChild(shadeBox);
            let innerHTML = firstChild.innerHTML;
            innerHTML = innerHTML.replace(reg,'');
            firstChild.innerText = innerHTML;
        }else {
            let innerHTML = firstChild.innerHTML;
            innerHTML = innerHTML.replace(reg,'');
            firstChild.innerText = innerHTML;
            this.shadeBox.style.display = 'block';
        }
    }
};

export default {
    placeholder: '',
    theme: 'snow',  // 主题
    modules: {
        toolbar: {
            container: toolOptions,  // 工具栏选项
            handlers: handlers  // 事件重写
        },
        imageDrop: true, // 拖动加载图片组件。
        imageResize: { //调整大小组件。
            displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        }
    },
    initButton: () => {      //在使用的页面中初始化按钮样式
        // 样式随便改
        const sourceEditorButton = document.querySelector('.ql-sourceEditor');
        sourceEditorButton.style.cssText = 'font-size:18px';

        // 加了elementui的icon
        sourceEditorButton.classList.add('el-icon-edit-outline');
        // 鼠标放上去显示的提示文字
        sourceEditorButton.title = '源码编辑';
    },
    register(q){
        //注册标签(因为在富文本编辑器中是没有div,table等标签的，需要自己去注册自己需要的标签)
        class div extends q.import('blots/block/embed') {}
        class table extends q.import('blots/block/embed') {}
        class tr extends q.import('blots/block/embed') {}
        class td extends q.import('blots/block/embed') {}
        div.blotName =div.tagName='div';
        table.blotName =table.tagName='table';
        tr.blotName =tr.tagName='tr';
        td.blotName =td.tagName='td';
        q.register(div);
        q.register(table);
        q.register(tr);
        q.register(td);
    }
};
