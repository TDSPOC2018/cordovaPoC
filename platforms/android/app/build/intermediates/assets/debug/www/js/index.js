/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        //カメラ起動
        var button = document.getElementById("camera");
        button.addEventListener("click",show_pic);

        //指紋のチェック
        var button = document.getElementById("checkStatus");
        button.addEventListener("click",touch_Check);
        //指紋の保存
        var button = document.getElementById("register");
        button.addEventListener("click",touch_Register);
        //指紋の取得
        var button = document.getElementById("get");
        button.addEventListener("click",touch_Get);
        //指紋の削除
        var button = document.getElementById("delete");
        button.addEventListener("click",touch_Delete);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function show_pic() {
    // カメラアプリを起動し、撮影して保存
    var option = {
        //sourceType: Camera.PictureSourceType.CAMERA,   // 撮影モード
        saveToPhotoAlbum: true, //撮影後端末に保存(iPhoneはOK)
        destinationType: Camera.DestinationType.FILE_URI,
        quality: 50
    };
    //撮影完了時に呼び出し
    function onSuccess() {
        alert("保存しました");
    }
    function onFail(message) {
        alert("エラー: " + message);
    }

    //カメラ呼び出し
    navigator.camera.getPicture(onSuccess, onFail, option);
}

function test(){
    alert("hellow");
}

function touch_Check(){
    window.plugins.touchid.isAvailable(function(result) {
        alert("指紋があります");
      }, err => {
        alert("指紋がありません");
      });
}

//保存・取得・削除キー
const myKey = 'jiojfoj77574Tehjfaljgf';

function touch_Register(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    alert(username);
    alert(password);
    //保存処理->splitできるように値を入れて保存
    window.plugins.touchid.save(myKey, username + " " + password, () => {
        //成功してもエラーコードが返るため、エラーコードにて分岐
    }, err => {
        const errcode = JSON.stringify(err);
        if(errcode=='"success"'){
            alert("保存成功しました->code"+ JSON.stringify(err))
        }
        else{
            alert("保存失敗しました->code"+ JSON.stringify(err))
        }
    });
}
function touch_Get(){
    const message = '指紋認証を行います';
    //取得処理
    window.plugins.touchid.verify(myKey, message, (str) => {
        //値をSplitして取得->これをサーバに投げてログインできる
        const username = str.split(' ')[0];
        const password = str.split(' ')[1];
        alert("ユーザ名は" + username + " パスワードは" + password + "です");
      }, err => {
        alert("取得失敗しました->code"+ JSON.stringify(err))
      });
} 

function touch_Delete(){
    //削除処理
    window.plugins.touchid.delete(myKey, () => {
        alert("パスワード削除完了"); 
      }, err => {
        alert("パスワード削除失敗->code" + JSON.stringify(err))
      });
}