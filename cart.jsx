// simulate getting products from DataBase
const products = [
  { name: "Apples", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage", country: "USA", cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [restock, setRestock] = React.useState(false);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);

  if(restock){

      let newItems = data["data"];
      //getting rid of out of stock items
      let itemsX = items.filter( (element)=>{
        return element["instock"] != 0;
      } );
      let itemListUpdated = [ ...itemsX, ...newItems];
      
      setRestock(false);
      setItems( itemListUpdated);
  }
  // Fetch Data
  const addToCart = (index) => {
    console.log('addToCart...')
    let itemAdded = items[index];
    console.log(`add to Cart ${JSON.stringify(itemAdded)}`);

    if (itemAdded.instock == 0) return;
    itemAdded.instock = itemAdded.instock - 1;
    setCart([...cart, itemAdded]);


  };
  const deleteCartItem = (index) => {
    let listCartRemoved = cart.filter((item, i) => index === i);
    let cartRemoved = listCartRemoved[0];
    let returnItemIndex  = items.findIndex( (itemZ, indexZ) =>{
      let ans = cartRemoved.name === itemZ.name;
      ans = ans && ( cartRemoved.country === itemZ.country);
      ans = ans && ( cartRemoved.cost === itemZ.cost);
      return ans
    })
    let returnedItem = items[returnItemIndex];
    returnedItem.instock = returnedItem.instock + 1;


    let newCart = cart.filter((item, i) => index != i);
    setCart(newCart);
  };
  let photos = {APPLES: "apple.png", ORANGES: "orange.png", BEANS: "beans.png", CABBAGE: "cabbage.png",
    NUTS: "nuts.jpg"
}
  // let photos = ["cabbage.png" , "apple.png", "orange.png", "beans.png","cabbage.png"];
  // photos[99] = "nuts.jpg";
  function nameToPhoto(itemY){
    let nameY = itemY.name;
        nameY = nameY.toUpperCase();
    let photoSrc = photos[nameY];
    return photoSrc;
  }
  let list = items.map((item, index) => {
    //let n = index + 1049;
    //let url = "https://picsum.photos/id/" + n + "/50/50";
    let photoindex = index + 1;
    if(item.name === undefined){
      item.name = item.attributes.name;
      item.cost = item.attributes.cost;
      item.instock = item.attributes.instock;
      item.country = item.attributes.country;
      photoindex = item.id;
    }else{
      item.id = photoindex;
    }
    console.log('reporting item')
    console.log(item);
    console.log('reporting index');
    console.log(index);
    let photoSrcX = nameToPhoto( item);
    console.log('photoSrcX');
    console.log(photoSrcX)
    console.log('item.name')
    console.log(item.name)
    

    return (
      <li key={index} >
        <Image src={photoSrcX} width={70} roundedCircle></Image>
        <Button name={item.name} index={index} type="submit" onClick={()=>addToCart(index)} variant="primary" size="large">
          {item.name+` $`+ item.cost}
          <br/>
          {`number in stock: ${items[index]["instock"]}`}
        </Button>
      </li>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <Accordion.Item key={1+index} eventKey={1 + index}>
      <Accordion.Header>
        {item.name}
      </Accordion.Header>

      <Accordion.Body
        >

          <Button className= "btn btn-secondary" >$ {item.cost} from {item.country} </Button>
        <br/>
        <Button className= "btn btn-primary" onClick={() => deleteCartItem(index)} eventKey={1 + index}>Remove from Cart </Button>
          <Accordion.Header>
            Hide
          </Accordion.Header>
      </Accordion.Body>
    </Accordion.Item>
    );
  });
  
  let Checkout = () => {
    let finalListTotal = finalList().total;
    setTotal(finalListTotal);
    return(
      <>
      <h1>CheckOut </h1>
      
      <Button eventkey= "checkout" className= "btn btn-primary" onClick={() => {
       //clearing cart contents( and checkout contents)
       console.log(`Customer Paid ${total} }`);
       setCart([]);
          }}
      >Pay {finalListTotal}</Button>
      <div> {finalListTotal > 0 && finalList().final} </div>
      </>

    )

  }

  let finalList = () => {
    let total = totalItemsCost();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const totalItemsCost = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  // TODO: implement the restockProducts function
  const restockProducts = (url) => {
    console.log('restocking...')
    // let newStock = doFetch().data
    // console.log(newStock);
    if(total != 0){
      window.alert("You must pay or Empty Shopping Cart Before Restocking");
    }else{
      setRestock(true);
    }


    // console.log(url);
    // url = 'http://localhost:1337/api/products'
    // let data = {};
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    
    
    // var requestOptions = {
    //   method: 'GET',
    //   headers: myHeaders,
    //   redirect: 'follow'
    // };
    
    // fetch("localhost:1337/Api/products", requestOptions)
    //   .then(result => {
    //     data=Data.data;
    //     console.log('here\'s the data');
    //     console.log(data);
    //   })
    //   .catch(error => console.log('error', error));
   
  };

    const undoLast = () => {
    if( cart.length === 0) return;
    let index = cart.length - 1;
    let listCartRemoved = cart.filter((item, i) => index === i);
    let cartRemoved = listCartRemoved[0];
    let returnItemIndex  = items.findIndex( (itemZ, indexZ) =>{
      let ans = cartRemoved.name === itemZ.name;
      ans = ans && ( cartRemoved.country === itemZ.country);
      ans = ans && ( cartRemoved.cost === itemZ.cost);
      return ans
    })
    let returnedItem = items[returnItemIndex];
    returnedItem.instock = returnedItem.instock + 1;

    
    let newCart = cart.filter((item, i) => index != i);
    setCart(newCart);
  };

  const rmvAll = ()=>{
    if( cart.length === 0) return;
    for( let j = 0; j < cart.length; j++){
      let listCartRemoved = cart.filter((item, i) => j === i);
      let cartRemoved = listCartRemoved[0];
     let returnItemIndex  = items.findIndex( (itemZ, indexZ) =>{
      let ans = cartRemoved.name === itemZ.name;
      ans = ans && ( cartRemoved.country === itemZ.country);
      ans = ans && ( cartRemoved.cost === itemZ.cost);
      return ans
      })
      let returnedItem = items[returnItemIndex];
      returnedItem.instock = returnedItem.instock + 1;

    }
    setCart([])
    
    
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Button className= "btn btn-primary" onClick={() => undoLast()} eventKey={2000}>Undo   </Button>
          <Button className= "btn btn-primary" onClick={() => rmvAll()} eventKey={2001}>Empty Cart</Button>
          <Accordion defaultActiveKey="0">{cartList}</Accordion>
        </Col>
        <Col>
          <Checkout></Checkout>
          
          
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/api/${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
