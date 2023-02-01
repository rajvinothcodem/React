import React from 'react';
import withRouter from './../router/withRouter';
import Shipping from './Shipping'
import { getCart, getItemImage, collectTotals, removeItem, applyCouponcode, deleteCouponcode, updateShoppingCart } from './Api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Spinner from './../page/Spinner';
class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            images: [],
            totals: {},
            coupon: '',
            loader: true,
            items: [],
            title: "shopping cart",
            shippingAssignments:[],
            triggerkey:""
        }
        this.couponRef = React.createRef(null);
        this.handleClick = this.handleClick.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }
    componentDidMount() {
        localStorage.setItem('id', this.props.params.id);
        localStorage.setItem('quote', this.props.params.quote);
        this.getCartItems();
        this.getCartTotals();
    }
    getCartItems = () => {
        let imageurl = [];
        getCart().then(data => {
            this.setState({ loader: true });
            this.setState({ products: data.items });
            this.setState({shippingAssignments:data.extension_attributes.shipping_assignments})
            this.setState({triggerkey:data.items_qty});
            data.items.map((item) => {
                getItemImage(item.sku).then(res => {
                    res && res.custom_attributes.map((img) => {
                        if (img.attribute_code == 'small_image') {
                            imageurl[item.sku] = `${process.env.REACT_APP_MAGENTO_PRODUCT_MEDIA + img.value}`;
                        }
                    })
                    this.setState({ images: imageurl });
                    this.setState({ loader: false });
                })
                    .catch(err => console.log(err));
            });
        })
            .catch(err => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ loader: false });
            });
    }

    getCartTotals = () => {
        collectTotals().then(resp => {
            this.setState({ totals: resp });
            this.setState({ loader: false });
        })
            .catch(err => console.log(err));

    }

    removeCartItem = (itemId) => {
        this.setState({ loader: true });
        removeItem(itemId).then(response => {
            if (response == true) {
                this.getCartItems();
                this.getCartTotals();
                toast.success("Item has been removed from the cart.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        })
            .catch(err => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ loader: false });
            });
    }

    addCouponCode = (couponCode) => {
        this.setState({ loader: true });
        applyCouponcode(couponCode).then(resp => {
            if (resp == true) {
                this.setState({ coupon: couponCode });
                localStorage.setItem('coupon', couponCode);
                this.getCartTotals();
                toast.success('Coupon code applied', {
                    position: toast.POSITION.TOP_CENTER
                });
            }

        })
            .catch(err => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ loader: false });
                this.couponRef.current.value = "";
            });
    }

    removeCouponCode = () => {
        this.setState({ loader: true });
        deleteCouponcode().then(data => {
            if (data == true) {
                localStorage.removeItem('coupon');
                this.getCartItems();
                this.getCartTotals();
                toast.error("Coupon code removed", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        })
            .catch(err => console.log(err => {
                toast.error(err.response.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ loader: false });
            }));
    }

    handleClick = () => {
        this.addCouponCode(this.couponRef.current.value);
    }

    handleRemove = () => {
        this.removeCouponCode();
    }

    changeCartItems = (event, product) => {

        let QtytoAdd = (event.target.value <= 0) ? parseInt(event.target.defaultValue) : parseInt(event.target.value);
        let cartItems = {
            "item_id": product.item_id,
            "sku": product.sku,
            "quote_id": product.quote_id,
            "qty": QtytoAdd
        }
        if (this.state.items.length !== 0) {
            if (this.state.items.some(itemm => itemm.item_id === product.item_id)) {
                this.state.items.map(item => {
                    if (product.item_id == item.item_id) {
                        item.qty = QtytoAdd
                    }
                })
            } else {
                this.state.items.push(cartItems);
            }
        } else {
            this.state.items.push(cartItems);
        }
    }

    updateCartItem = () => {
        this.setState({ loader: true });
        let updateCart = [];
        this.state.items.map((item, index) => {
            updateShoppingCart(item).then(resp => {
                updateCart.push(resp.item_id);
                if (updateCart.length == this.state.items.length) {
                    this.getCartItems();
                    this.getCartTotals();
                    this.setState({ items: [] });
                    toast.success("Shopping Cart Updated", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({ loader: false });

                }
            })
                .catch(err => {
                    toast.error(err.response.data.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({ loader: false });
                });

        })
    }

    updateNewTotals(updateTotals)
    {
        this.setState({ totals: updateTotals });
    }


    render() {
        return (
            <React.Fragment>
                <h3>Shopping Cart</h3>
                {this.state.products.length > 0 && (
                    <div className="page">
                        <table>
                            <thead>
                                <tr>
                                    <th>SNO</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>QTY</th>
                                    <th>Subtotal</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.products.length > 0 && this.state.products.map((item, index) =>
                                    <tr key={item.sku}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td> <img width="150" height="150" src={this.state.images[item.sku]} /></td>
                                        <td>{item.sku}</td>
                                        <td>${item.price}</td>
                                        <td><input className="qty" type="number" min="1" name="qty" defaultValue={item.qty} onChange={(e) => this.changeCartItems(e, item)} /></td>
                                        <td>${item.qty * item.price}</td>
                                        <td><button className="remove" onClick={() => this.removeCartItem(item.item_id)}><span>Remove</span></button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="buttonscol">
                            <div className="updateCartBtn">
                                <button className="update" name="updateCart" onClick={() => this.updateCartItem()}>
                                    <span>UpdateShoppingCart</span>
                                </button>
                            </div>
                            <div className="totalswrapper">
                                <ul className="totals">
                                    {this.state.totals.total_segments && this.state.totals.total_segments.map((total, index) =>
                                        <li key={index}>
                                            <strong>{total.title}</strong>
                                            : ${total.value}
                                        </li>
                                    )}
                                </ul>
                                <a href="/checkout" className="proceedCheckout"><span>Proceed to Checkout</span></a>
                            </div>
                        </div>
                        <div class="coupon">
                            <h4>Coupon</h4>
                            {!this.state.totals.coupon_code && (
                                <React.Fragment>
                                    <input type="text" name="coupon" ref={this.couponRef} />
                                    <button class="add" onClick={this.handleClick}><span>Apply</span></button>
                                </React.Fragment>
                            )}
                            {this.state.totals.discount_amount < 0 && this.state.totals.coupon_code && (
                                <React.Fragment>
                                    <input type="text" name="coupon" value={this.state.totals.coupon_code} disabled />
                                    <button class="remove" onClick={this.handleRemove}><span>Remove</span></button>
                                </React.Fragment>
                            )}
                        </div>
                        <Shipping key={this.state.triggerkey} shippingAssignments={this.state.shippingAssignments} totals={this.updateNewTotals.bind(this)} />
                    </div>
                )}
                <ToastContainer />
                {this.state.products.length == 0 && (
                    <div>Your Shopping cart is empty  </div>
                )}
                <Spinner enable={this.state.loader} />
            </React.Fragment>
        );
    }
}
export default withRouter(Cart);