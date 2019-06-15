<template>
    <div id="message">
        <jg-table title="留言管理" width="600px">
            <div slot="jgTable-content">
                <el-form ref="form" :model="form" label-width="80px">
                    <div class="double_child">
                        <el-form-item label="用户ID">
                            <el-input v-model="form.userId">   
                            </el-input>
                        </el-form-item>
                        <el-form-item label="用户昵称">
                            <el-input v-model="form.nickName">   
                            </el-input>
                        </el-form-item>
                    </div>
                    <el-form-item label="音频ID">
                        <el-input v-model="form.vedioID">   
                        </el-input>
                    </el-form-item>
                    <el-form-item label="留言内容">
                        <el-input v-model="form.content">   
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="jgTable-foot">
                <el-button type="primary" @click="addNewMessage">新增留言</el-button>
            </div>
        </jg-table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {

            }
        }
    },
    methods: {
        addNewMessage(){
            this.$http.post(this.$apis.addNewMessage,this.form).then((resp)=>{
                console.log(resp)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    #message{
        width: 100%;
        height: 100%;
    }
</style>
