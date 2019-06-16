<template>
    <div id="daily">
        <jg-table title="设置日历接口" width="600px">
            <div slot="jgTable-content">
                <el-form ref="form" :model="form" label-width="80px">
                    <div class="double_child">
                        <el-form-item label="日期">
                            <el-date-picker
                            v-model="form.daily"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="点赞数">
                            <el-input v-model="form.liked"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="日历背景">
                        <input type="file" @change="getFile($event)">
                    </el-form-item>
                    <div class="double_child">
                        <el-form-item label="描述作者">
                            <el-input v-model="form.description.author"></el-input>
                        </el-form-item>
                        <el-form-item label="描述标题">
                            <el-input v-model="form.description.title"></el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="描述内容">
                        <el-input v-model="form.description.content"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="jgTable-foot">
                <el-button type="primary" @click="setDailyBackground">提交</el-button>
            </div>
        </jg-table>
        <jg-table title="查看日历背景图片" width="600px" style="margin-top: 20px">
            <div slot="jgTable-content">
                <el-date-picker
                v-model="daily"
                type="daterange"
                value-format="yyyy-MM-dd"
                ange-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>     
                <el-button type="primary" @click="findDailyBackground">查看日期背景</el-button>
                <table class="DailyBackground">
                    <template  v-for="(item,index) in imgUrls" >
                        <tr :key="index">
                            <td>{{item.daily}}</td>
                            <td class="dailyImg">
                                <img :src="item.url" />
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
        </jg-table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            form:{
                description:{}
            },
            show:'',
            daily:[],
            imgUrls:[]
        }
    },
    methods: {
        getFile(ev){
            this.form.dailyIMG = ev.target.files[0]
        },
        findDailyBackground(){
            this.$http.get(this.$apis.findDailyBackground,{from:this.daily[0],to:this.daily[1]}).then((resp)=>{
                console.log(resp)
                if(resp.data.data.length){
                    for(let i=0;i<resp.data.data.length;i++){
                        const url = process.env.VUE_APP_BaseURL + resp.data.data[i].imgURL.split('\\').join('/').substring(1);
                        const date = new Date(Number(resp.data.data[i].daily))
                        const Y = date.getFullYear() + '-';
                        const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                        const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
                        const daily = Y+M+D
                        this.imgUrls.push({url,...resp.data.data[i],daily})
                    }
                }
            })
        },
        setDailyBackground(){
            let formData = new FormData();
            formData.append('daily', this.form.daily);
            formData.append('liked', this.form.liked);
            formData.append('dailyIMG', this.form.dailyIMG);
            formData.append('description', JSON.stringify(this.form.description));

            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.post(this.$apis.setDailyBackground,formData,config).then((resp)=>{
                console.log(resp)
            })
        }    
    }
}
</script>

<style lang="scss" scoped>
    #daily{
        width: 100%;
        height: 100%;
    }
    .DailyBackground{
        height: 150px;
        margin-top: 5px;
        img{
            height: 100%
        }
    }
    table{
        margin: 0;
        padding: 0
    }
    .dailyImg{
        display: flex;
        justify-content: center;
        align-items: center;
        img{
            height: 40px
        }
    }
</style>
