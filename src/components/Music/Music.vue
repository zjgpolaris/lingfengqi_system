<template>
    <div id="music">
        <jg-table title="新增音频" width="600px">
            <div slot="jgTable-content">
                <el-form ref="form"  label-width="80px">
                    <el-form-item label="音频类型">
                        <el-select v-model="musicType" placeholder="请选择">
                            <el-option
                            v-for="item in MusicType"
                            :key="item._id"
                            :label="item.type"
                            :value="item.type">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="音频">
                        <input type="file" @change="getVideo($event)">
                    </el-form-item>
                    <el-form-item label="音频图片">
                        <input type="file" @change="getIcon($event)">
                    </el-form-item>
                </el-form>
                <el-row>
                    <el-col :span="6"><div >校验文件进度</div></el-col>
                    <el-col :span="18">
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="check" status="success"></el-progress>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div >上传文件进度</div></el-col>
                    <el-col :span="18">
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="progress"></el-progress>
                    </el-col>
                </el-row>
            </div>
            <div slot="jgTable-foot">
                <el-button type="primary" @click="uploadMusic">新增</el-button>
            </div>
        </jg-table>
        <jg-table title="音频列表" width="600px" style="margin-top:15px">
            <table slot="jgTable-content">
                <tr v-for="(item,index) in MusicList" :key="index">
                    <td>{{item.name}}</td>
                    <td>
                        <img :src="'http://localhost:3000'+item.icon.replace(/\\/g,'/')" :alt="item.name">
                    </td>
                    <td>
                        <el-button type="danger" size="mini" @click="deleteMusic(item._id)">删除</el-button>
                    </td>
                </tr>
            </table>
        </jg-table>  
    </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
import axios from 'axios'
import {mapGetters} from 'vuex'
export default {
    data () {
        return {
            musicType:'',
            chunkSize : 1 * 1024 * 1024,
            fileSize : 0,
            file : null,
            hasUploaded : 0,
            chunks : 0,
            iconInput:null,
            fileMd5Value : '',
            check: 0,
            progress:0
        }
    },
    computed:{
        ...mapGetters(['MusicList','MusicType'])
    },
    methods: {
        deleteMusic(_id){
            console.log(JSON.stringify({musicList:[{_id}]}))
            const musicList =JSON.stringify([{_id}])
            this.$http.post(this.$apis.deleteMusic,{musicList:musicList}).then((resp)=>{
                console.log(resp)
                this.$store.dispatch('loadMusicList')
            })
        },
        getVideo(ev){
            console.log(ev.target.files);
            let files = ev.target.files;
            this.file = files[0];
            this.fileSize = files[0].size;
        },
        getIcon(ev){
            console.log(ev.target.files);
            this.iconInput = ev.target.files[0];
        },
        uploadMusic(){
            if(!this.file){
                this.$message('当前没有选择文件')
                return false
            }
            console.log('进入提交')
            this.startUpload(this.file,this.musicType)
            
        },
        async startUpload(file,musicType){
            this.fileMd5Value = await this.md5File(file);
            let _this = this
            let result = await this.checkFile(file.name,this.fileMd5Value)
            console.log("result",result);
            if(result.file){
                this.$message('文件已秒传成功')
                return false;
            }else{

                console.log("文件还没有上传");
                await this.checkAndUploadChunk(this.fileMd5Value, result.chunkList||[],file.name,musicType)
            }
        },
        //校验文件是否存在
        checkFile(fileName, fileMd5Value){ 
            const _this = this
            return new Promise((resolve,reject)=>{
                _this.$http.get(_this.$apis.checkFile,{fileName,fileMd5Value,musicType:_this.musicType}).then((resp)=>{
                    console.log(resp);
                    resolve(resp.data)
                })
            })  
        },
        async checkAndUploadChunk(fileMd5Value, chunkList,filename,musicType){
            console.log(fileMd5Value, chunkList,filename,musicType);
            this.chunks = Math.ceil(this.fileSize / this.chunkSize);
            this.hasUploaded = chunkList.length;
            for(let i = 0; i < this.chunks; i++){
                let existChunk = chunkList.indexOf(i + "") > -1;
                //存在则不再上传
                if(!existChunk){
                    await this.uploadChunk(i, fileMd5Value, this.chunks,filename,musicType);
                    this.hasUploaded++
                    //计算百分比
                    let percent = Math.floor((this.hasUploaded / this.chunks) * 100);
                    this.progress = percent
                }
            }
        },
        uploadChunk(i, fileMd5Value, chunks,filename,musicType){
            const _this =this
            return new Promise((resolve, reject) => {
                let end = (i + 1) * this.chunkSize >= this.file.size ? this.file.size : (i + 1) * this.chunkSize;
                //构建一个表单
                let form = new FormData()
                form.append("vedio", this.file.slice(i * this.chunkSize, end));
                form.append("totalChunks", this.chunks);
                form.append("currChunk", i);
                form.append("fileMd5Value", fileMd5Value);
                form.append('filename',filename.replace(/ /g,''))
                form.append('musicType',musicType)
                if((i+1)==chunks){
                    form.append('iconInput',this.iconInput)
                }
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                axios.post(this.$apis.uploadMusic,form,config).then((resp)=>{
                    resolve(resp);
                    _this.$store.dispatch('loadMusicList')
                })
            })
        },
        md5File(file){
            let _this = this
            return new Promise((resolve, reject) => {
            var blobSlice = File.prototype.slice || File.prototype.webkitSlice || File.prototype.mozSlice,
                chunkSize = file.size / 100,
                chunks = 100,
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();

            fileReader.onload = function(e){
                spark.append(this.result);
                currentChunk++;

                if(currentChunk < chunks){
                    loadNext();
                }else{
                    resolve(spark.end());
                }
            }

            function loadNext(){
                let start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : (start + chunkSize);
                
                fileReader.readAsArrayBuffer(blobSlice.apply(file, [start, end]));
                _this.check = currentChunk + 1
            }

            loadNext();
        })
        }
    }
}
</script>

<style lang="scss" scoped>
    #music{
        width: 100%;
        height: 100%;
    }
</style>
