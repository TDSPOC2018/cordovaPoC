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

        //音声機能の確認、マイク使用許可
        var button = document.getElementById("voicePermission");
        button.addEventListener("click",voice_Prepare);
        //音声機能の確認、マイク使用許可
        var button = document.getElementById("voiceDo");
        button.addEventListener("click",voice_Do);
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
            alert("保存成功しました->code:"+ JSON.stringify(err))
        }
        else{
            alert("保存失敗しました->code:"+ JSON.stringify(err))
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
        alert("取得失敗しました->code:"+ JSON.stringify(err))
      });
} 

function touch_Delete(){
    //削除処理
    window.plugins.touchid.delete(myKey, () => {
        alert("パスワード削除完了"); 
      }, err => {
        alert("パスワード削除失敗->code:" + JSON.stringify(err))
      });
}

function voice_Prepare(){
    // プラグインの音声入力が可能かどうか判定
    window.plugins.speechRecognition.isRecognitionAvailable(
    function(available) {
      if(available){
        // 利用可能なら、マイク使用の許可を求める。
        window.plugins.speechRecognition.requestPermission(
          function(res) {
              alert("これでマイクが使えるようになりました");
          }, function(err){
            alert("許可をもらえないとマイクが使えません");
        });
      }
    }, 
    function(err){
      alert("音声入力プラグインが利用できません。");
  });
}
// 音声入力用メソッド
function voice_Do(){
    // 音声入力の事前設定
    var micOptions = {
      language : "ja-JP", // 言語は日本語
      matches : 1         // 結果の候補数
    }
  
    //デバイスごとに呼び出し方を変更する（判定にはhttps://github.com/apache/cordova-plugin-deviceを使用）
    if(device.platform=='Android') {
      window.plugins.speechRecognition.startListening( micSuccess,  micError,  micOptions );
    } else if(device.platform=='iOS') {
      showIosVoiceDialog(micOptions);
    } else {
      alert("AndroidとiOS以外は対応しておりません")
    }
  }
  
  // 音声入力成功時のコールバックメソッド
  function micSuccess(result){
      document.getElementById('voiceResult').value=result;    
  }
  
  // 音声入力失敗時のコールバックメソッド
  function micError(result) {
      alert("失敗しました->code:" + result) ;
  }
  
  function showIosVoiceDialog(micOptions) {
    // 音声入力開始
    window.plugins.speechRecognition.startListening( micSuccess,  micError,  micOptions );
  
    // 音声入力中のダイアログを表示する。
    ons.notification.confirm({
      messageHTML: '<div style="text-align:center"><ons-icon icon="fa-microphone" size="30px" /><br><span style="font-size:14px">音声入力中...</span></div>',
      title: '音声入力テスト',
      primaryButtonIndex: 1,
      cancelable: false,
      modifier: 'material',
      callback: function(index) {
          switch(index) {
            case 1:
              //OKを押した時、音声入力終了
              window.plugins.speechRecognition.stopListening();
              break;
            case 0:
              // Cancelを押した時の処理
              // MEMO:中断したいけど、中断メソッドがプラグインに用意されていない模様
              window.plugins.speechRecognition.stopListening();
              break;
          }
      }
    });
  }