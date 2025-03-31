from flask import Flask, jsonify, request, send_file
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import bcrypt
import os
from flask_cors import CORS
import uuid
import gridfs
import jwt
import io
from bson import ObjectId


load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False
app.config["JSON_AS_ASCII"] = False
client = MongoClient(os.getenv("uri"))
secret = os.getenv("secret")
db = client['Growthzi-Assignment']
fs = gridfs.GridFS(db)

@app.route("/", methods=['POST'])
def hello():
    return jsonify({"message":"Hello"}), 200

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password =  data.get("password")
        name = data.get("name")
        user = data.get("user")
        phone =  data.get("phone")
        if not email or (not password):
            return jsonify({"status":"data"}), 400
        checker = db.Users.find_one({"email":email})
        if checker:
            return jsonify({"stauts":"email"}), 409
        checker2 = db.Users.find_one({"phone":phone})
        if checker2:
            return jsonify({"status":"phone"}), 409
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(13))
        db.Users.insert_one({"name":name, "phone":phone, "user":user, "email":email, "password":hashed.decode("utf-8"), "userId":str(uuid.uuid4())[:50]})
        return jsonify({"status":"success"}), 200
    except Exception as e:
        return jsonify({"status":"server"}), 500

@app.route("/signin", methods = ["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        checker = db.Users.find_one({"email":email})
        if not checker:
            return jsonify({"status":"email"}), 404
        hashed = bcrypt.checkpw(password.encode("utf-8"), checker['password'].encode("utf-8"))
        if not hashed:
            return jsonify({"status":"password"}), 400
        token = jwt.encode({"id":checker['userId']}, key=secret)
        return jsonify({"status":"success", "user":checker['userId'], "token":token}), 200
    except:
        return jsonify({"status":"server"}), 500

@app.route("/order", methods=["POST"])
def order():
    body = request.get_json()
    userId = body.get("user")
    productId = body.get("product")
    time = datetime.now()
    return jsonify({"user":userId, "product":productId, "time":time}), 200

@app.route("/addCart", methods=["POST"])
def addCart():
    data = request.get_json()
    productId = data.get("product")
    userId = data.get("user")
    checker = db.Users.find_one({"userId":userId})
    if not checker:
        return jsonify({"status":"invalid user"}), 404
    db.Cart.insert_one({"product":productId, "user":userId})
    return jsonify({"status":"success"}), 200

@app.route("/countCart", methods = ["POST"])
def countCart():
    user = request.get_json().get("user")
    return jsonify({"count":len(db.Cart.find({"user":user}).to_list())})

@app.route("/deleteCart", methods=['PUT'])
def deleteCart():
    data = request.get_json()
    productId = data.get("product")
    userId = data.get("user")
    deleter = db.Cart.delete_one({"user":userId, "product":productId})
    if deleter:
        return jsonify({"status":"done"}), 200

@app.route("/fetchCart", methods=['POST'])
def fetchCart():
    try:
        data = request.get_json()
        user = data.get("user")
        checker = db.Cart.find({"user": user}, {"_id":0}).to_list()
        if not checker:
            return jsonify({"status":"empty"}), 200
        list1 = []
        for i in checker:
            list1.append(db.Product.find({'id':i['product']}))
        return jsonify(checker), 200
    except:
        return jsonify({"status":"server"}), 500

@app.route("/getImage", methods=['POST'])
def getImage():
    try:
        data = request.form
        filename = data.get("filename")
        file = fs.find_one({"_id":ObjectId(filename)})
        if not file:
            return jsonify({"status":"not found"}), 404
        response = io.BytesIO(file.read())
        return send_file(response, mimetype="image/png"), 200
    except Exception as e:
        return jsonify({"status":"server"}), 500
    
@app.route("/addProduct", methods=["POST"])
def addProduct():
    try:
        data = request.form
        user = data.get("user")
        title = data.get("title")
        price = data.get("price")
        desc = data.get("desc")
        imgURL = data.get("image")
        quantity = data.get("quantity")
        if(imgURL is not None):
            inserter = db.Product.insert_one({"imageLink":imgURL, "title":title, "price":int(price), "desc":desc, "user":user, "productId":str(uuid.uuid4())[:50]})
            if inserter:
                return jsonify({"status":"success"}), 200
        image = request.files['image']
        file_id = fs.put(image, filename=image.filename)
        if file_id:
            db.Product.insert_one({"image":file_id, "title":title, "price":int(price), "desc":desc, "user":user, "productId":str(uuid.uuid4())[:50]})
            return jsonify({"stauts":"success"}), 200
        else:
            return jsonify({"status":"server"}), 500
    except Exception as e:
        return jsonify({"status":"server"}), 500

@app.route("/updateProduct", methods = ['POST'])
def updateProduct():
    try:
        data = request.form
        product = data.get("id")
        title = data.get("title")
        price = data.get("price")
        desc = data.get("desc")
        db.Product.update_one({"productId":product}, {"$set":{"title":title, "desc":desc, "price":price}})
        return jsonify({"status":"success"}), 200
    except Exception as e:
        return jsonify({"status":"server"}), 500

@app.route("/deleteProduct", methods=['POST'])
def deleteProduct():
    data = request.get_json()
    user = data.get("token")
    product = data.get("product")
    userId = jwt.decode(user, key=secret, algorithms="HS256")
    finder = db.Product.find_one({"productId":product})
    deleter = db.Product.delete_one({"user":userId['id'], "productId":product})
    if deleter:
        return jsonify({"status":"success"})
    else:
        return jsonify({"status":"server"}), 500

@app.route("/fetchCreatedProducts", methods = ["POST"])
def fetchCreatedProducts():
    try:
        data = request.get_json()
        user = data.get("user")
        list1 = list(db.Product.find({"user":user}, {"_id":0}))
        for i in range(len(list1)):
            if "imageLink" not in list1[i]:
                list1[i]['image'] = str(list1[i]['image'])
        return jsonify(list1), 200
    except:
        return jsonify({"stauts":"server"}), 500

@app.route("/fetchOneProduct", methods=["POST"])
def fetchProducts():
    try:
        data = request.get_json()
        product = data.get("product")
        list1 = list(db.Product.find({"productId":product}, {"_id":0}))
        for i in range(len(list1)):
            list1[i]['image'] = str(list1[i]['image'])
        return jsonify(list1), 200
    except Exception as e:
        return jsonify({"status":"server"}), 500

@app.route("/fetchDatabase", methods = ['POST'])
def fetchDatabase():
    try:
        list1 = [i for i in list(db.Product.find({}, {"_id":0}))]
        for i in range(len(list1)):
            if "imageLink" not in list1[i]:
                list1[i]['image'] = str(list1[i]['image'])
        return jsonify(list1), 200
    except Exception as e:
        return jsonify({"status":"server"}), 500

@app.route("/createOrder", methods=["POST"])
def create_order():
    """Creates a new order with amount, product_id, and user_id"""

    data = request.json
    id = jwt.decode(data.get("token"), key=os.getenv("secret"), algorithms=["HS256"])

    # Validate ObjectIds
    try:
        product_id = data.get("productId")
        user_id = data.get("userId")
        checked = data.get("coupon")
    except:
        return jsonify({"error": "Invalid product_id or user_id"}), 400

    # Create order document
    vendor = db.Product.find_one({"productId":product_id})
    print(vendor, product_id)
    order = {
        "order_id":str(uuid.uuid4())[:40],
        "product_id": product_id,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "vendor":vendor['user'],
        "status":"pending",
        "coupon":checked
    }

    # Insert into MongoDB
    inserted_order = db.Orders.insert_one(order)

    return jsonify({
        "status": "success",
    }), 201

@app.route("/shipOrder", methods=['POST'])
def shipOrder():
    try:
        data = request.get_json()
        token = data.get("token")
        id = jwt.decode(token, key=os.getenv("secret"), algorithms=["HS256"])
        product = data.get("order")
        db.Orders.update_one({"order_id":product}, {"$set":{"status":"shipped"}})
        print("Hi", db.Orders.find_one({"order_id":product}), product, data)
        return jsonify({"status":"success"}), 200
    except Exception as e:
        print(e)
        return jsonify({"status":"server"}), 500

@app.route("/customerOrders", methods=['POST'])
def customerOrder():
    data = request.get_json()
    try:
        token = data.get("token")
        id = jwt.decode(token, key=os.getenv("secret"), algorithms=['HS256'])
        orders = list(db.Orders.find({"vendor":id['id'], "status":"pending"}))
        for i in range(len(orders)):
            orders[i]["_id"] = str(orders[i]['_id'])
            orders[i]['title'] = db.Product.find_one({"productId":orders[i]["product_id"]}, {"_id":0, "title":1})['title']
        return jsonify({"status":"success", "orders":orders}), 200
    except Exception as e:
        print(e)
        return jsonify({"status":"server"}), 500

@app.route("/orderHistory", methods = ['POST'])
def orderHistory():
    try:
        data = request.get_json()
        token = data.get("token")
        id = jwt.decode(token, key=os.getenv("secret"), algorithms=['HS256'])
        products = []
        ids = list(db.Orders.find({"user_id":id['id']}))
        for i in ids:
            products.append(db.Product.find_one({"productId":i['product_id']}, {"_id":0}))
        for i in range(len(products)):
            products[i]['image'] = str(products[i]['image'])
            products[i]['status'] = ids[i]['status']
        print(products)
        return jsonify({"status":"success", "orders":products}), 200
    except:
        return jsonify({"status":"server"}), 500

@app.route("/userData", methods= ['POST'])
def userData():
    try:
        data = request.get_json()
        user = data.get("user")
        cursor = db.Users.find_one({"userId":user})
        return jsonify({"name":cursor['email'], "user":cursor['user']}), 200
    except:
        return jsonify({"status":"server"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)