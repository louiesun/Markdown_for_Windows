<template>
  <div id="vditorEle" class="vditor vditor--fullscreen"></div>
</template>

<script setup>
import { ref } from 'vue';

var Opened = false;


</script>

<script async>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import {ElMessageBox, ElNotification} from "element-plus"
import vditorConf from '../config/vditor-config.js'
import svgIcons from '../config/vditor-toolbar-svg.js'

export default {
  name: "MyVditor.vue",
  data() {
    return {
      vditor: '',
      welcome: 'Type Here or Open file with(Ctrl+O)',
      project_url: 'localhost:1145',
      lang: 'en_US',
      // 静态资源 https://cn.vitejs.dev/guide/assets.html#the-public-directory
      cdn: '/vditor-cdn',
    };
  },
  mounted() {
    let self = this
    if (!vditorConf.options.hasOwnProperty('lange')) {
      vditorConf.options.lange = this.lang // for i18n
      vditorConf.options.placeholder = this.welcome
      // conf local cdn
      vditorConf.options.cdn = this.cdn
      vditorConf.options.preview.theme.path = this.cdn + '/dist/css/content-theme'
      vditorConf.options.hint.emojiPath = this.cdn + '/dist/images/emoji'
      // with tauri toolbar
      vditorConf.toolbar.unshift({
        name: "openOrSave",
        tip: "File",
        // icon: '<svg t="1597727407471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1167" width="32" height="32"><path d="M376.832 474.112H130.048c-33.792 0-61.44-27.648-61.44-61.44V165.888c0-33.792 27.648-61.44 61.44-61.44h247.296c33.792 0 61.44 27.648 61.44 61.44v247.296c-0.512 33.792-27.648 60.928-61.952 60.928zM130.048 165.888v247.296h247.296V165.888H130.048zM739.84 525.312c-16.384 0-31.744-6.144-43.52-17.92L521.728 332.8c-11.776-11.776-17.92-27.136-17.92-43.52s6.144-31.744 17.92-43.52L696.32 71.168c11.776-11.776 27.136-17.92 43.52-17.92s31.744 6.144 43.52 17.92L957.952 245.76c11.776 11.776 17.92 27.136 17.92 43.52s-6.144 31.744-17.92 43.52L783.36 507.392c-11.776 11.776-27.136 17.92-43.52 17.92z m0-411.136l-174.592 174.592 174.592 174.592 174.592-174.592-174.592-174.592zM376.832 960.512H130.048c-33.792 0-61.44-27.648-61.44-61.44v-247.296c0-33.792 27.648-61.44 61.44-61.44h247.296c33.792 0 61.44 27.648 61.44 61.44v247.296c-0.512 34.304-27.648 61.44-61.952 61.44z m-246.784-308.224v247.296h247.296v-247.296H130.048zM863.232 960.512h-247.296c-33.792 0-61.44-27.648-61.44-61.44v-247.296c0-33.792 27.648-61.44 61.44-61.44h247.296c33.792 0 61.44 27.648 61.44 61.44v247.296c0 34.304-27.136 61.44-61.44 61.44z m-246.784-308.224v247.296h247.296v-247.296h-247.296z" p-id="1168"></path></svg>',
        icon: svgIcons.folder,
        tipPosition: 's',
        toolbar: [
          {
            hotkey: '⌘o',
            name: "openMdFile",
            tipPosition: 's',
            icon: 'Open File',
            click() {
              self.openMdFile()
            }
          },
          {
            hotkey: '⌘s',
            name: "SaveMdFile",
            icon: 'Save File',
            click() {
              self.saveMdFile()
            }
          },
          {
            name: "saveAsMdFile",
            icon: 'Save as',
            click() {
              self.saveAsMdFile()
            }
          },
          {
            name: "ExportHtml",
            icon: 'Export to HTML',
            click() {
              self.ExportHtml()
            }
          },
          // {
          //   hotkey: '⌘p',
          //   name: "ExportPdf",
          //   icon: '导出为pdf',
          //   click() {
          //     self.ExportPdf()
          //   }
          // },
          {
            hotkey: '⌘w',
            name: "Close",
            icon: 'Close',
            click() {
              self.CloseMDFile()
            }
          },
        ],
        click() {
        }
      })
      vditorConf.toolbar.push({
        name: "more",
        tipPosition: 's',
        toolbar: [
          // "export",
          "outline",
          "preview",
          "both",
          "code-theme",
          "content-theme",
          "devtools",
          // "info",
          "help",
          {
            name: "about",
            icon: '关于',
            click() {
              self.showAbout()
            }
          },
        ],
      })
      vditorConf.options.toolbar = vditorConf.toolbar;
    }
    this.vditor = new Vditor('vditorEle', vditorConf.options);

    this.InitMD();
  },
  methods: {
    async InitMD()
    {
      var FileText =await aardio.InitFile();
      if(FileText==null) return false;
      if(FileText==false||FileText==null)
      {
        ElNotification.error('FilePath Not Exists. or Failed to Read the File. ');
        return false;
      }
      this.vditor.setValue(FileText);
      this.Opened=true;
    },
    async CloseMDFile()
    {
      this.vditor.setValue('');
      await aardio.CloseFile();
      this.Opened=false;
    },
    async openMdFile(Url) {
      var FileText = await aardio.OpenFile(Url);
      if(FileText==false||FileText==null)
      {
        ElNotification.error('FilePath Not Exists. or Failed to Read the File. ');
        return false;
      }
      this.vditor.setValue(FileText);
      this.Opened=true;
    },
    async saveMdFile() {
      if(this.Opened==false) return this.saveAsMdFile();
      else 
      {
          var Success=await aardio.SaveFile(this.vditor.getValue());
          if(Success==false)
          {
            ElNotification.error('Failed to Save');
            return false;
          }
      }
    },
    async saveAsMdFile() {
      var FilePath=await aardio.SaveAsFile();
      if(FilePath==null||FilePath==false) 
      {
          ElNotification.error('FilePath Not Exists. ');
          return false;
      }
      var Success=await aardio.SaveFile(this.vditor.getValue());
      if(Success==false)
      {
        ElNotification.error('Failed to Save. ');
        return false;
      }
      this.Opened=true;
    },
    async ExportHtml() {
      var Success=await aardio.SaveAsHTML(this.vditor.getHTML());
      if(Success==false)
      {
        ElNotification.error('Failed to Export. ');
        return false;
      }
    },
    async ExportPdf() {
      ElNotification.error('Not Supported Yet. ');
    //   const filePath = await dialog.save({
    //     filters: [{
    //       name: 'MarkDownFile',
    //       extensions: ['md']
    //     }]
    //   })
    //   if (filePath == null) {
    //     // console.log(filePath)
    //     ElNotification.error('文件路径获取失败')
    //     return false
    //   }
    // await writeFile({
    //     path: filePath,
    //     contents: this.vditor.getValue()
    //   }).then(() => {
    //   }, () => {
    //     ElNotification.error('文件保存失败')
    //     return false
    //   })
      return false;
    },
    showAbout() {
      ElMessageBox.alert(
          '&nbsp;&nbsp;&nbsp;&nbsp;' +
          'This is a simple Markdown Editor for Windows based on Vditor' +
          'Github👉 <a target="_blank" href="https://github.com/louiesun/Markdown_for_Windows">github.com/louiesun/Markdown_for_Windows</a><br/>' +
          'Thanks🙏<br/>' +
          '<a target="_blank" href="https://aardio.com/">Aardio(a IDE with aardio for Windows Development)</a> 、' +
          '<a target="_blank" href="https://b3log.org/vditor/">Vditor</a> 、' +
          '<a target="_blank" href="https://element-plus.org">Element Plus</a> <br/>' +
          '<br/>' +
          'Released under the <a target="_blank" href="https://www.gnu.org/licenses/gpl-3.0.html>GPL-3.0-or-later License</a> <br/>' +
          'Made by 💗 louiesun href="https://github.com/louiesun">louiesun</a>',
          'About',
          {
            dangerouslyUseHTMLString: true
          });      
      },
    openWindow(url) {
      new WebviewWindow('theUniqueLabel', {
        url: url
      })
    },
  },
}
</script>