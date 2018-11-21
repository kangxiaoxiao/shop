<template>
    <div class="editHeroWrapper">
        <el-form :model="form" label-width="80px" ref="form">
            <el-form-item label="姓名">
               <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="form.sex"></el-input>
            </el-form-item>
            <el-form-item label="籍贯">
                <el-input v-model="form.nativePlace"></el-input>
            </el-form-item>
            <el-form-item label="位置">
                <el-input v-model="form.location"></el-input>
            </el-form-item>
            <el-form-item label="台词">
                <el-input v-model="form.lines"></el-input>
            </el-form-item>
            <el-form-item label="封面">
                <el-upload
                        class="avatar-uploader"
                        action=""
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :http-request="uploadImg"
                >
                    <img v-if="form && form.cover" :src="img_headUrl+form.cover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="详情">
                <el-upload
                    action=""
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemoveCard"
                    :multiple="true"
                    :http-request="handleFileCard"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img
                      width="100%"
                      :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item>
                <el-button
                        type="primary"
                        @click="submit"
                >提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: "editHero",
        data(){
            return {
               id:"",
                img_headUrl:"",
                dialogVisible:false,
                dialogImageUrl:"",
                fileList:[],
                form:{
                    name:"",
                    age:"",
                    sex:"",
                    nativePlace:"",
                    location:"",
                    lines:"",
                    cover:"",
                    imgs:[]
                }
            }
        },
        mounted(){
          let _this=this;
          _this.id=_this.$route.query.id;
          _this.img_headUrl=process.env.VUE_APP_IMG_HEAD_URL;
          console.log("img_headUrl",_this.img_headUrl);
          if(_this.id){
              _this.form.id="";
           _this.getHeroDetail();
          }
        },
        methods:{
            getHeroDetail(){
                let _this=this;
                axios({
                    method: 'get',
                    url: '/heros/heroDetail',
                    params: {
                        _id: _this.id
                    }
                }).then(res=>{
                    if(res.data.status==0){
                        _this.form=res.data.hero;
                        if(_this.form.imgs && _this.form.imgs.length>0){
                           _this.handleImgList();
                        }
                    }
                });
            },
            handleImgList(){
                let _this=this;
                _this.fileList=_this.form.imgs.map(item=>{
                    return {
                        name:"",
                        url:_this.img_headUrl+item
                    }
                });
            },
            submit(){
                if(this.id){
                    this.editHero()
                }else{
                    this.addHero()
                }
            },
            editHero(){
                let _this=this;
                let params=_this.form;
                axios({
                    method:"post",
                    url:"/heros/editHero",
                    data:params
                }).then(res=>{
                    if(res.data.status==0){
                        this.$notify({
                            message: '修改成功！',
                            type: 'success'
                        });
                        _this.$router.push({path:"/heroList"});
                    }else{
                        this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            addHero(){
                let _this=this;
                let params=_this.form;
                axios({
                    method:"post",
                    url:"/heros/addHero",
                    data:params
                }).then(res=>{
                    if(res.data.status==0){
                        this.$notify({
                            message: '新增成功！',
                            type: 'success'
                        });
                        _this.$router.push({path:"/heroList"});
                    }else{
                        this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                })
            },
            //图片上传成功回调
            handleAvatarSuccess(res, file) {
                this.form.cover = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            uploadImg:function(params){
                let _this=this;
                let url="/heros/uploadImg";
                var formData = new FormData();
                formData.append('photos',params.file);  //将图片内容放入formData中
                axios({
                    method:"post",
                    url:url,
                    data:formData
                }).then(res=>{
                    if(res.data.status==0){
                        _this.$notify({
                            message: '添加图片成功！',
                            type: 'success'
                        });
                        _this.form.cover=res.data.result
                    }else{
                        _this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                });
            },
            handleRemoveCard(file) {
                let _this=this;
                if(_this.form.imgs.indexOf(file.url.split(_this.img_headUrl)[1])!=1){
                    _this.form.imgs.splice(_this.form.imgs.indexOf(file.url.split(_this.img_headUrl)[1]),1);
                }
            },
            handlePictureCardPreview(file) {
                let _this=this;
                _this.dialogImageUrl=file.url;
                _this.dialogVisible = true;
            },
            handleFileCard:function(params){
                let _this=this;
                let url="/heros/uploadImg";
                var formData = new FormData();
                formData.append('photos',params.file);  //将图片内容放入formData中
                axios({
                    method:"post",
                    url:url,
                    data:formData
                }).then(res=>{
                    if(res.data.status==0){
                        _this.$notify({
                            message: '添加图片成功！',
                            type: 'success'
                        });
                        for(let key in res.data.result){
                            _this.form.imgs.push(res.data.result[key]);
                        }
                    }else{
                        _this.$notify({
                            message:res.data.msg,
                            type: 'warning'
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .editHeroWrapper{
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>