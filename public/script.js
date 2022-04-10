const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

// api/v1/tasksからタスクの読み込み

const showTasks = async () =>{
    try{
        //自作のapi
const {data:tasks} = await axios.get("/api/v1/tasks");

//タスクが一つもないとき
if(tasks.length < 1){
    tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`
}

console.log(tasks)
   //タスクを出力
   const allTasks = tasks.map((task)=>{
       const {completed, _id, name} = task
      
       return ` <div class="single-task ${completed && "task-completed"}">
       <h5>
           <span> <i class="fas fa-check-circle"></i></span>${name}
       </h5>
       <div class="task-links">
           <!--編集リンク-->
           <a href="edit.html?id=${_id}" class="edit-link">
                <i class="fas fa-edit"></i>
           </a>
           <!--ごみ箱リンク-->
           <button type="button" class="delete-btn" data-id="${_id}">
               <i class="fas fa-trash"></i>
           </button>
       </div>
   </div>`;

   }).join("")
   tasksDOM.innerHTML = allTasks

    }catch(err){
        console.log(err)

    }
};

showTasks();

//タスクの新規作成
formDOM.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const name = taskInputDOM.value;
    try{    
        await axios.post("/api/v1/tasks",{name:name});
        showTasks();
        taskInputDOM.value="";
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent ="タスクを追加しました"
    }catch(err){
        console.log(err)
        formAlertDOM.style.display = "block";
        formAlertDOM.innerHTML ="無効です、再度やり直しください"

    }
　　setTimeout(()=>{
    formAlertDOM.style.display = "none";
},3000);
    
})

//タスクの削除
tasksDOM.addEventListener("click",async(e)=>{
    const element = e.target;
    console.log(element.Parent)
    if(element.parentElement.classList.contains("delete-btn")){
        const id = element.parentElement.dataset.id;
        try{
          await axios.delete(`/api/v1/tasks/${id}`)
          showTasks();
        }catch(err){
            console.log(err)
        }
    }
})