<template>
  <div>
    <el-button @click="add">添加数据</el-button>
    <!--  数据查找  -->
    <el-button @click="searchData" style="margin-bottom: 20px">查找</el-button>
    <!--  数据显示和操作  -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}">
      <el-table-column
        fixed
        prop="id"
        label="序号"
        sortable
        style="width:20%">
      </el-table-column >
      <el-table-column prop="name" label="姓名" ></el-table-column>
      <el-table-column prop="gender" label="性别" ></el-table-column>
      <el-table-column prop="email" label="邮箱" ></el-table-column>
      <el-table-column prop="department" label="部门" ></el-table-column>
      <el-table-column prop="number" label="身份证号" ></el-table-column>
      <el-table-column prop="address" label="地址" ></el-table-column>

      <el-table-column label="操作" style="width:20%">
        <template slot-scope="scope">
          <el-button type="text" @click="handleClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  弹出的编辑输入框  -->
    <el-dialog :title="content" :visible.sync="formDialog.dialogFormVisible">
      <el-form ref="form" :model="formDialog" label-width="80px">
        <el-form-item label="名字">
          <el-input v-model="formDialog.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="formDialog.number" :disabled="formDialog.modify"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="formDialog.address"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱"
                      :rules="[
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]">
          <el-input v-model="formDialog.email"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="region">
          <el-select v-model="formDialog.department">
            <el-option label="技术部" value="1"></el-option>
            <el-option label="市场部" value="2"></el-option>
            <el-option label="调研部" value="3"></el-option>
            <el-option label="后勤部" value="4"></el-option>
            <el-option label="运营部" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="formDialog.gender">
            <el-radio label="男" ></el-radio>
            <el-radio label="女" ></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleOrNot(true,type)">确认</el-button>
          <el-button @click="handleOrNot(false,type)">取消</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
    <!--  弹出数据编辑框  -->
    <el-dialog :title="content" :visible.sync="form.Visible">
      <!--  数据输入  -->
      <el-form ref="form"  :model="form" label-width="80px">
        <el-form-item label="名字">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="身份证号">
          <el-input v-model="form.number"></el-input>
        </el-form-item>

        <el-form-item label="家庭地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>

        <el-form-item prop="email" label="邮箱"
                      :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ]">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="部门" prop="region">
          <el-select v-model="form.department">
            <el-option label="技术部" value="1"></el-option>
            <el-option label="市场部" value="2"></el-option>
            <el-option label="调研部" value="3"></el-option>
            <el-option label="后勤部" value="4"></el-option>
            <el-option label="运营部" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="男" ></el-radio>
            <el-radio label="女" ></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加数据</el-button>
          <el-button @click="clearData()">重新输入数据</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import $ from 'core-js/internals/string-trim'
//axios全局配置
// axios.defaults.timeout=3000;  //超时时间
// axios.defaults.baseURL='http://localhost:8081/';
export default {
  data () {
    return {
      form: {
        //存储用户信息
        id:'',
        name: '',
        gender: '',
        email:'',
        department:'',
        number:'',
        address:'',
        Visible:false
      },
      formDialog: {
        //存储用户信息
        id:'',
        name: '',
        gender: '',
        email:'',
        department:'',
        dialogFormVisible: false,
        number:'',
        address:'',
        //  判断是否修改
        flag:true,
        //用于判断是否可以修改,true表示不可以修改
        modify:true
      },
      content:"",
      // 修改数据所在的行号
      raw:'',
      tableData: [],
      // 用于判断操作的类型
      type:'',

    }
  },
  methods: {
    //添加数据
    onSubmit () {
      if (this.form.gender!=='')
      {
        console.log($.trim(this.form.address))
        axios.post('staff/add',
          {
            "name":$.trim(this.form.name),
            "gender":$.trim(this.form.gender)==='男'?'1':'0',
            "email":$.trim(this.form.email),
            "department":$.trim(this.form.department),
            "idnumber":$.trim(this.form.number),
            "address":$.trim(this.form.address)
          }
        ).then(res=>{
          console.log(res)
          if(res.data.msg==='该员工已存在')
          {
            alert('该员工已存在,添加失败！！')
          }
          else {
            this.tableData=[]
            this.clearData()
            this.readData()
          }

        }).catch(err=>{
          alert(err.response.data.msg)
        })
      }
      else {
        alert("性别不能为空！")
      }
    },
    //提交数据后 将添加的数据清空
    clearData () {
      this.form = {
        //存储用户姓名
        name: '',
        date1: '',
        gender: '',
      }
    },
    //数据编辑或者查找弹窗
    handleClick (row) {
      this.row=row;
      //显示弹窗
      this.formDialog.dialogFormVisible=true;
      this.content="数据编辑弹窗"
      this.type='1';
      this.formDialog.modify=true;
      //填充数据
      this.formDialog.name=row.name;
      this.formDialog.email=row.email;
      this.formDialog.department=this.changeToNum(row.department);
      this.formDialog.gender=row.gender;
      this.formDialog.number=row.number,
      this.formDialog.address=row.address
    },
    //数据查询弹窗
    searchData(){
      //显示弹窗
      this.formDialog.dialogFormVisible=true
      this.content="数据查询弹窗"
      this.type='2'
      this.formDialog.modify=false
      //填充数据
      this.formDialog.name=''
      this.formDialog.email=''
      this.formDialog.department=''
      this.formDialog.gender=''
      this.formDialog.number=''
      this.formDialog.address=''
    },
    //判断进行数据编辑或者数据查找
    handleOrNot(flag,type){
      //类型一为数据编辑
      if(flag&&type==='1') {
        axios.post('staff/update',
          {
            "id":this.row.id,
            "name":this.formDialog.name,
            "gender":this.formDialog.gender==='男'?"1":"0",
            "email":this.formDialog.email,
            "department":this.formDialog.department,
            "number":this.formDialog.number,
            "address":this.formDialog.address
          }
        ).then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
        this.tableData=[]
        this.readData()
      }
      //类型二为数据查找
      else if(flag&&type==='2'){
        //先将显示表置空
        this.tableData=[]
        //构建查询表达式

        let p={}
        if ($.trim(this.formDialog.name)!==''){
          p.name=$.trim(this.formDialog.name)!==''
        }
        if ($.trim(this.formDialog.gender)!==''){
          p.gender=this.formDialog.gender==='男'?"1":"0"
        }
        if ($.trim(this.formDialog.department)!==''){
          p.department=$.trim(this.formDialog.department)
        }
        if ($.trim(this.formDialog.email)!==''){
          p.email=$.trim(this.formDialog.email)
        }
        if ($.trim(this.formDialog.address)!==''){
          p.address = $.trim(this.formDialog.address)
        }
        if ($.trim(this.formDialog.number)!==''){
          p.idnumber=$.trim(this.formDialog.number)
        }


        axios.post('staff/eqquery?pageSize=150',p
        ).then(res=>{
          let arr=res.data.data.records
          for(let i=0;i<arr.length;i++){
            this.tableData.unshift({
              id:arr[i].id,
              name:arr[i].name,
              gender:(arr[i].gender==='1')?'男':'女',
              email:arr[i].email,
              department: this.changeToName(arr[i].department),
              number:arr[i].idnumber,
              address:arr[i].address
            })
          }
        }).catch(err=>{
          console.log(err)})
      }
      this.formDialog.dialogFormVisible=false;

    },
    //删除数据
    deleteData (row) {
      axios.get('staff/delete',
        {
          params:{
            "id":row.id
          }
        }
      ).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
      var index=this.tableData.findIndex((item)=>{
        if(item.id===parseInt(row.id))
          return true
      })
      this.tableData.splice(index,1);
    },
    // 将部门序号 更改为部门汉字
    changeToName(number) {
      switch (number) {
        case '1':
          return '技术部';
          break;
        case '2':
          return '市场部';
          break;
        case '3':
          return '调研部';
          break;
        case '4':
          return '后勤部';
          break;
        case '5':
          return '运营部';
          break;
      }
    },
    // 将部门汉字转换为部门id
    changeToNum(str){
      switch (str){
        case '技术部':
          return '1';
          break;
        case '市场部':
          return '2';
          break;
        case '调研部':
          return '3';
          break;
        case '后勤部':
          return '4';
          break;
        case '运营部':
          return '5';
          break;
      }
    },
    //从服务器中读取数据(可以刷新显示列表)
    readData(){
      axios.get('staff/staffs',
        {params:{
            pageSize:10000,
          }
        }).then(res=>{
        let arr=res.data.data.records
        for(let i=0;i<arr.length;i++){
          this.tableData.unshift({
            id:arr[i].id,
            name:arr[i].name,
            gender:(arr[i].gender==='1')?'男':'女',
            email:arr[i].email,
            department: this.changeToName(arr[i].department),
            number:arr[i].idnumber,
            address:arr[i].address
          })
        }
      }).catch(err=>{
        console.log(err)})
    },
    add(){
      this.form.Visible=true
    }
  },
  created() {
    this.readData()
  }
}
</script>

<style scoped>

</style>
