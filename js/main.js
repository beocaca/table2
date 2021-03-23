import 'regenerator-runtime/runtime'

import axios from "axios";

var baseUrl = 'https://satlegal.ebitc.com/api'

var list = []
var avtDefault = 'https://ehoadonvnpt.vn/public/uploads/system/noavatar.gif'

window.getGroup = async function getGroup() {
  //var endPoint = `${baseUrl}/dummies/groups/?page=${1}/`
  var response = await axios.get(`${baseUrl}/dummies/groups/?page=${1}`)
  try {
    addTitleGroup()
    addFieldGroup()
    list = [...response.data.results]
    list.forEach(elm => {
      renderGroup(elm)
    })
    enterToAdd()
    console.log(list)
  } catch (e) {

  } finally {

  }
}

function addFieldGroup() {
  var a = document.querySelector('#table')
  var html = `
    <div class="user-item">
        <div class="user-line ">
          <div class="control-delete addField">
            <div  class="count-number">
            Add
            </div>
            <div onclick="" class="link-pop">
              <i class="fas fa-external-link-alt"></i>
            </div>
            <div onclick="" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line ">
          <input data-0="name" class="input-user" type="text" data-field='name' onchange="addGroup()">
        <div class="err-mess">
            <span err-0 ="name"></span>
        </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

function addTitleGroup() {
  var a = document.querySelector('#table')
  var html = `
        <div class="user-item">
        <div class="user-line">
          <span>Id</span>
        </div>
        <div class="user-line">
          <span>Group</span>
        </div>
      </div>
  `
  a.insertAdjacentHTML('afterbegin', html)
}

//href="http://localhost:1234/user.html?group=${elm.id}"

function renderGroup(elm) {
  var all = document.querySelectorAll('.user-item')
  var a = all[all.length - 1]
  var html = `
      <div class="user-item">
        <div class="user-line">
          <div class="control-delete">
            <div class="count-number">
              ${elm.id}
            </div>
            <div class="link-pop">
              <a onclick="pushStateUser(${elm.id},event)" href="http://localhost:1234/?group=${elm.id}"><i class="fas fa-external-link-alt"></i></a>
            </div>
            <div onclick="showDelete(event)" class="menu-delete">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div onclick="delGroup(${elm.id},event)" class="delete-click">DELETE Group</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line">
          <input class="input-user" type="text" value="${elm.name}" data-${elm.id}="name"  onchange="editGroup(${elm.id},event)">
          <div class="err-mess">
            <span err-${elm.id}="name"></span>
          </div>
        </div>
      </div>
    `
  a.insertAdjacentHTML("beforebegin", html)
}

function clearField() {

  var all = document.querySelectorAll('[data-0]')
  all.forEach(elm => {
    if(elm.files){
      document.querySelector('[last-img-add]').src = avtDefault
    }
    elm.value = ''
  })
}

window.changeFileUpload = function changeFileUpload(evt) {
  var elmInput = evt.target
  var files = elmInput.files
  var imgHolder = elmInput.nextElementSibling
  if (files && files[0]) {
    var FR = new FileReader()
    FR.onload = function (e) {
      imgHolder.src = e.target.result
    }
    FR.readAsDataURL(files[0])
  }
}

function getDataField(id = 0) {
  var allFieldElm = document.querySelectorAll(`[data-${id}]`)
  var jsonData = {}
  var formData = new FormData()

  allFieldElm.forEach(elm => {
    var fieldName = elm.getAttribute(`data-${id}`)
    var isFieldUpload = elm.files
    if (isFieldUpload) {
      var arrFiles = Object.values(elm.files)
      for (var i = 0; i < arrFiles.length; i++) {
        jsonData[fieldName] = arrFiles[i]
        formData.append([fieldName], arrFiles[i])
      }

    } else {
      var fieldValue = elm.value
      jsonData[fieldName] = fieldValue
      formData.append(fieldName, fieldValue)
    }
  })
  return {
    jsonData,
    formData
  }
}


function renderCount(length) {
  var all = document.querySelectorAll('.count-number')
  for (var i = 0; i < length; i++) {
    all[i].innerHTML = i + 1
  }
}

function renderError(id = 0, errors) {

  var errKeys = Object.keys(errors)
  errKeys.forEach(k => {
    var arrMess = errors[k]
    var strMess = arrMess.join()
    document.querySelector(`[err-${id} = "${k}"]`).textContent = strMess
  })
}

function removeErr(id = 0) {
  var all = document.querySelectorAll(`[err-${id}]`)
  all.forEach(elm => {
    elm.textContent = ''
  })
}

window.addGroup = async function addGroup() {
  if (document.querySelector('[data-field]').value === "") {
    return 0
  }
  var dataPost = getDataField()
  var dataPostFormData = dataPost.formData
  var endPoint = `${baseUrl}/dummies/groups/`
  var newId = null
  try {
    var response = await axios.post(endPoint, dataPostFormData)
    var newGroup = response.data
    list.push(newGroup)
    renderGroup(newGroup)
    newId = newGroup.id
    clearField(0)
    console.log(list)
    removeErr()
  } catch (e) {
    if (e.response) {
      removeErr()
      var errors = e.response.data
      renderError(0, errors)
    }
  }
}

window.delGroup = async function delGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  try {
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove()
    var response = await axios.delete(endPoint)
    var index = list.findIndex(e => {
      return e.id == `${id}`
    })
    list.splice(index, 1)
    console.log(list)
  } catch (e) {
  }
}

window.editGroup = async function editGroup(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${id}/`
  // var value = e.target.value
  var dataPost = getDataField(id)
  var dataPostFormData = dataPost.formData
  try {
    var response = await axios.put(endPoint, dataPostFormData)
    removeErr(id)
    /*  var newGroup = response.data
      initResponseEdit(newGroup, id)*/
    console.log(response.data)
  } catch (e) {
    if (e.response) {
      var errors = e.response.data
      renderError(id, errors)
    }
  }
}

window.editUser = async function editUser(id) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  var dataPost = getDataField(id)
  var dataPostFormData = dataPost.formData
  try {
    var response = await axios.put(endPoint, dataPostFormData)
    removeErr(id)
    console.log(response)
  } catch (e) {
    var a = (e.response.data)
    removeErr(id)
    renderError(id, a)
  }
}


window.showDelete = function showDelete(event) {
  event.target.parentElement.classList.toggle('show')
}

function enterToAdd() {
  var a = document.querySelector('[data-field="name"]')
  a.addEventListener("keyup", e => {
    if (e.isComposing || e.keyCode === 13) {
      addGroup()
    }
  });

  /*
    var all = document.querySelectorAll('[group-id]')
    all.forEach(elm => {
      var id = elm.getAttribute('group-id')
      elm.addEventListener("keyup", e => {
        if (e.isComposing || e.keyCode === 13) {
          editGroup(`${id}`, event)
        }
        // do something
      });
    })
  */
}

var listUser = []

window.getUsers = async function getUsers(groupID) {
  var endPoint = `${baseUrl}/dummies/groups/${groupID}/users/`
  try {
    var respone = await axios.get(endPoint)
    listUser = [...respone.data.results]
    addTitleUser()
    addFieldUser()
    listUser.forEach(elm => {
      renderUsers(elm)
    })
    console.log(listUser)
  } catch (e) {

  } finally {

  }
}

// href="http://localhost:1234/user.html/namlala=${user.id}"


function renderUsers(user) {
  var all = document.querySelectorAll('.user-item')
  var a = all[all.length - 1]
  if (user.avatar == null) {
    user.avatar = avtDefault
  }

  var html = `
      <div class="user-item">
        <div class="user-line ">
          <div class="control-delete">
            <div class="count-number">
              ${user.id}
            </div>
            <div class="link-pop">
              <a href="http://localhost:1234/user.html/namlala=${user.id}" ><i class="fas fa-external-link-alt"></i></a>
            </div>
            <div onclick="showDelete(event)" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div onclick="delUser(${user.id},event)" class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>

        <div class="user-line box-img">
          <input multiple accept="image/*" onchange="editUser(${user.id}),changeFileUpload(event)" data-${user.id}="avatar" class="input-user" type="file" value="${user.avatar}">
          <img src="${user.avatar}">
          <div class="err-mess">
              <span err-${user.id}="first_name"> </span>
          </div>
        </div>

        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="first_name" class="input-user" type="text"  value="${user.first_name}">
        <div class="err-mess">
        <span err-${user.id}="first_name"> </span>
        </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="last_name" class="input-user" type="text"  value="${user.last_name}">
          <div class="err-mess">
            <span err-${user.id}="last_name"></span>
          </div>
        </div>
        <div class="user-line ">
          <input onchange="editUser(${user.id})" data-${user.id}="email" class="input-user" type="text"  value="${user.email}">
          <div class="err-mess">
         <span err-${user.id}="email"></span>
          </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforebegin', html)
}

function addTitleUser() {
  var a = document.querySelector('#table')
  var html = `
       <div class="user-item">
        <div class="user-line user-stt">
          <span>Id</span>
        </div>
        <div class="user-line user-avatar">
          <span>Avatar</span>
        </div>
        <div class="user-line user-first">
          <span>FirstName</span>
        </div>
        <div class="user-line user-last">
          <span>LastName</span>
        </div>
        <div class="user-line user-email">
          <span>Email</span>
        </div>
      </div>
  `
  a.insertAdjacentHTML('afterbegin', html)
}

function addFieldUser() {
  var a = document.querySelector('#table')
  var html = `
    <div class="user-item">
        <div class="user-line ">
          <div class="control-delete">
            <div  class="count-number">
            Add
            </div>
            <div onclick="addUser(event)" class="link-pop">
              <i class="fas fa-external-link-alt"></i>
            </div>
            <div onclick="showDelete(event)" class="menu-delete ">
              <i class="fas fa-ellipsis-v"></i>
              <div class="menu-delete-detail">
                <div class="delete-click">DELETE</div>
              </div>
              <div class="bg-cover"></div>
            </div>
          </div>
        </div>
        <div class="user-line box-img">
          <input class="input-user" type="file" data-0='avatar' onchange="changeFileUpload(event)">
          <img last-img-add src="${avtDefault}" alt="">
            <div class="err-mess">
                <span err-0 ="avatar"></span>
            </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='first_name' ">
            <div class="err-mess">
                <span err-0 ="first_name"></span>
             </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='last_name' ">
            <div class="err-mess">
                <span err-0 ="last_name"></span>
             </div>
        </div>
        <div class="user-line ">
          <input class="input-user" type="text" data-0='email' ">
            <div class="err-mess">
                 <span err-0 ="email"></span>
             </div>
        </div>
      </div>
  `
  a.insertAdjacentHTML('beforeend', html)
}

window.addUser = async function addUser() {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/`
  var dataPost = getDataField()
  var dataPostFormData = dataPost.formData
  try {
    var response = await axios.post(endPoint, dataPostFormData)
    var newUser = response.data
    renderUsers(newUser)
    removeErr(0)
    clearField()
    console.log(response.data)
  } catch (e) {
    if (e.response) {
      removeErr(0)
      var errors = e.response.data
      renderError(0, errors)
    }
  }
}

window.initResponseEdit = function initResponseEdit(newItem, id) {
  var all = document.querySelectorAll(`[data-${id}]`)
  all.forEach(elm => {
    var nameKey = elm.getAttribute(`data-${id}`)
    elm.value = newItem[nameKey]
  })
}

window.delUser = async function delUser(id, e) {
  var endPoint = `${baseUrl}/dummies/groups/${getIdGroup()}/users/${id}/`
  try {
    var index = listUser.findIndex(e => e.id == id)
    list.splice(index, 1)
    var response = await axios.delete(endPoint)
    e.target.parentElement.parentNode.parentNode.parentNode.parentNode.remove()
    console.log(e)
  } catch (e) {
  }
}

function initFormValue(item) {
  var all = document.querySelectorAll(`[data-name]`)
  all.forEach(elm => {
    var fieldName = elm.getAttribute('data-name')
    elm.value = item[fieldName]
  })
}

function reset() {
  document.querySelector('#table').innerHTML = ''
}


window.getIdGroup = function getIdGroup() {
  var a = location.href
  var b = new URL(a)
  var c = b.searchParams.get('group')
  return c
}

window.pushStateUser = function pushStateUser(id, e) {
  e.preventDefault()
  // history.pushState({id}, `Selected=${id}`, `/user.html?group=${id}`)
  history.pushState({id}, `Selected=${id}`, `index.html?group=${id}`)
  reset();
  getUsers(id);
  console.log(e)
}

window.addEventListener('popstate', e => {
  reset()
  console.log(e);
  if (e.state && e.state.id !== null) {
    getUsers(e.state.id)
  } else {
    getGroup()
  }
})

//history.replaceState({id: null}, `Default`, `./`)

window.onpopstate = function(event) {
  console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
};

(_ => {
  let groupID = getIdGroup();
  if (groupID) {
    getUsers(groupID)
  }else {
    getGroup()
  }

})();





