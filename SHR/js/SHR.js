{
    const doc = document;
    const user = doc.querySelectorAll( "[name=user]" );
    const addItemButton = document.querySelector("#btn_add");
    const createForm = doc.querySelector( "[name=createForm]" );
    const map = new Map();
    const rmap = new Map();
    const all = document.querySelector("#all");
    const release = document.querySelector("#release")
    let checkflag = false;

    // #region メソッド

    /***
     * 対象ユーザー取得処理
     * checkBoxItems：ユーザーのチェックボックス群
     * 戻り値：対象ユーザー数
     *  */
    function getTargetUserNum( checkBoxItems ) {
        
        let idx = 0;

        checkBoxItems.forEach(checkBoxItem => {
            // チェックボックス取得 
            let checkBox = checkBoxItem.querySelector( "input" );
            // チェックボックスのチェックのついてる項目のみ
            if(checkBox.checked){
                // チェックのついてる項目からユーザー名を取得
                let label = checkBoxItem.querySelector( "label" );
                // [key:要素番号(連番)、value:名前]の配列を用意
                map.set(idx, label.innerText);
                // [key:名前、value:要素番号(連番)]の配列を上記配列の削除用として用意
                rmap.set(label.innerText, idx);
                idx++;
            }
        }); 
        return map.size;
    }

    /***
     * チーム作成
     * teamNum：作成するチームの数
     * targetUserNum：対象ユーザー数
     * targetUserNum：チームの最大メンバー数
     * amari:余りユーザー数
     * 戻り値：なし
     *  */
    function createTeams( teamNum, targetUserNum, teamMenberNum, amari) {
        // チーム用の配列をチーム数分作成
        let teams = new Array(teamNum); 

        // 全体のチーム数だけ処理繰り返しユーザーを各チームに振り分ける
        for(let i = 0; i < teamNum; i++){
            let team = new Map();
            let name = "";
            while(true){
                // 対象者の中からランダムで1人の名前を取得する。
                name = map.get(Math.floor(Math.random() * targetUserNum));
                if(name != undefined && !team.has(name)){
                    // 名前が取得でき、まだチームにも名前が追加されていなければチームにユーザーを追加する。
                    team.set(name, name);
                    // 追加後は対象者の配列からは削除する
                    map.delete(rmap.get(name));
                }
                if(team.size == teamMenberNum){
                    // チームの人数とチームの最大メンバー数が一致した場合、処理を中断する。
                    break;
                }
                if(amari != 0 && i == (teamNum-1) && name != undefined){
                    // 余りの処理が行われた場合、余りの数を減算する。
                    amari--;
                }
                else if(amari == 0 && i == (teamNum-1) && map.size == 0){
                    // あまりがなくなった場合、処理を中断する。
                    break;
                }
            }
            // チーム群に作成したチームを代入する。
            teams[i] = team;
        }

        // チームのメンバーをテーブル要素で作成
        createTableElement(teams);
    }

    /***
     * テーブル要素作成
     * teams：テーブルを作成したいチームの情報
     * 戻り値：なし
     *  */
    function createTableElement( teams ) {
        let idx = 0;
        // チームの数だけ処理を繰り返す
        teams.forEach(team => {
            // 作成したテーブルの追加先情報取得
            const tables = document.querySelector("[name=tables]");
            // テーブル要素作成
            const table = document.createElement("table");
            const thead = document.createElement( "thead" );
            const tbody = document.createElement( "tbody" );
            const header = document.createElement("th");
            // チーム名を付与
            header.innerText = "チーム" + ++idx;
            // チームに属しているメンバーの情報を1行ずつ作成
            for(let entry of team.entries()) {
                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.innerText = entry[0];
                row.append(cell);
                tbody.append(row);
            }
            // 作成したデータを追加
            thead.append(header);
            table.append(thead);
            table.append(tbody);
            table.setAttribute( "class", "table" );
            thead.setAttribute("class", "header");
            tbody.setAttribute("class", "body");
            tables.append(table); 
        });
    }
    
    

    /***
     * テーブル要素削除
     * 戻り値：なし
     *  */
    function deleteTableElement() {
        // テーブルが作成されている場合削除
        const element = document.querySelectorAll('table');
        if(element.length != 0){
            element.forEach(item => {
                item.remove();
            });
        }
    }

    // #endregion メソッド

    // #region イベント

    // #region 作成ボタンクリック時の処理
    addItemButton.addEventListener("click", (event) => {
        // ボタンクリックのデフォルト処理を停止
        event.stopPropagation();
        event.preventDefault();

        // テーブル要素が作成済みなら削除
        deleteTableElement();

        // 配列クリア
        map.clear();
        rmap.clear();

        // 対象メンバー算出
        let targetUserNum = getTargetUserNum(user);

        // チーム数 = チェック対象者数 / チーム人数 (余る人がいる場合、余りの人だけでチームを組むので1チーム追加)
        let teamMenberNum = createForm.querySelector("input").value;
        let teamNum = Math.floor(targetUserNum / teamMenberNum);
        let amari = targetUserNum % teamMenberNum;
        if(amari != 0){
            teamNum++;
        }

        // チーム作成
        createTeams(teamNum, targetUserNum, teamMenberNum, amari);
    });
    // #endregion 作成ボタンクリック時の処理
    
    // #endregion イベント

    //全チェック全解除処理
    function chengeAllcheck(checkBoxItems, checkflag){
        checkBoxItems.forEach(checkBoxItem => {
            let checkBox = checkBoxItem.querySelector( "input" );
            checkBox.checked = checkflag;
        });
    }
    all.onclick = function() {
        checkflag = true;
        chengeAllcheck(checkBoxItems, checkflag);
    }

    release.onclick = function() {
        checkflag = false;
        chengeAllcheck(checkBoxItems, checkflag);
    }
    
}