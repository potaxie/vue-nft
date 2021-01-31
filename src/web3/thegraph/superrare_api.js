const axios = require("axios");
const mysql = require("mysql");

/*------------------------------------mysql util-------------------------------------*/
var connection = mysql.createConnection({
  host: "139.196.39.186",
  user: "root",
  password: "Potaxie_root123",
  port: "3306",
  database: "nft",
});

function insert_mysql(insert_sql, insert_value) {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        "MYSQL_INSERT_SQL_______",
        insert_sql,
        "MYSQL_INSERT_VALUE_______",
        insert_value
      );
      connection.query(insert_sql, insert_value, function(err, result) {
        if (err) {
          console.log("[INSERT ERROR] - ", err.message);
          reject(err);
        } else {
          // console.log('INSERT ID:', result);
          console.log("INSERT ID:", insert_value[0]);
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

query_url = "https://api.thegraph.com/subgraphs/name/protofire/superrare";

/*-------------------------------------查询订单数据-------------------------------------*/
// connection.connect();
const sale_query_sql = `{
    saleLogs(first: 5,orderBy: timestamp, orderDirection: desc){
      item {
      id
      tokenId
      descriptorHash
      name
      description
      salePrice
      createdBy
      imageUri
      salePrice
      modified
    }
    seller{
      address
    }
    buyer{
      address
    }
    amount
    timestamp 
    }
  }
`;

let insert_sql = `INSERT INTO superrare_sale_info (id,token_id,item_name,createdBy,description,imageUri,imageUri_base64,salePrice,buyer,seller,updated_time) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

console.log("start_thegraph___________________");
var query_function = function(query_url, sale_query_sql) {
  axios
    .post(query_url, {
      query: sale_query_sql,
    })
    .then((res) => {
      // console.log("data_result:_______", res.data.data.saleLogs);
      (async () => {
        for (const js_obj of res.data.data.saleLogs) {
          id = js_obj.item.id;
          token_id = js_obj.item.tokenId;
          item_name = js_obj.item.name;
          createdBy = js_obj.item.createdBy;
          description = js_obj.item.description;
          imageUri = js_obj.item.imageUri;
          salePrice = js_obj.item.salePrice;
          buyer = js_obj.buyer.address;
          seller = js_obj.seller.address;
          updated_time = new Date(parseInt(js_obj.item.modified) * 1000);
          console.log(
            "value________",
            id,
            token_id,
            createdBy,
            description,
            imageUri,
            salePrice,
            buyer,
            seller,
            updated_time,
            "\n"
          );
          //数据插入mysql
          let insert_value = [
            id,
            token_id,
            item_name,
            createdBy,
            description,
            imageUri,
            "0",
            salePrice,
            buyer,
            seller,
            updated_time,
          ];
          await insert_mysql(insert_sql, insert_value);
          console.log("finish_thegraph___________________");
        }
        connection.end();
      })();
    })
    .catch((error) => {
      console.error(error);
    });
};

//执行查询，插入结果数据到mysql
query_function(query_url, sale_query_sql);

/*-------------------------------------查询物品数据-------------------------------------*/

const item_query_sql = `
  {
    items (first: 5,orderBy: modified, orderDirection: desc,where:{name:"Puissance by VRUoT"}){
      id
      tokenId
      descriptorHash
      name
      description
      salePrice
      createdBy
      imageUri
      salePrice
      modified
    }
  }

`;
