import React from 'react';
import { isEmailAvailable, getCustomerToken, getCustomerAddresses } from './../cart/Api';
import loadingimg from './../page/images/loader-1.gif';
import { ToastContainer, toast } from 'react-toastify';
class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: true,
            loadingimg: false,
            username: "",
            password: "",
            token: "",
            cart:{},
            addresses:[],
            setAddress:false

        }
    }

    checkIfEmailExist(event) {
        this.setState({ loadingimg: true })
        this.setState({ username: event.target.value })
        isEmailAvailable(event.target.value).then(response => {
            this.setState({ email: response })
            this.setState({ loadingimg: false })
        }).catch(err => console.log(err));
    }

    handlePassword(e) {
        this.setState({ password: e.target.value });
    }

    setShippingAddress = (addressId) =>{
        console.log(addressId);
    }

    loginCustomer = () => {
        let customer = {
            "username": this.state.username,
            "password": this.state.password
        }
        this.setState({ loadingimg: true })
        getCustomerToken(customer).then(response => {
            this.setState({ token: response });
            localStorage.setItem("quote", response);
            getCustomerAddresses(response).then(data =>{
                    this.setState({cart:data, addresses:data.customer.addresses})
                
            }).catch(err=>{console.log(err)})
            this.setState({ loadingimg: false })
        }).catch(err => {
            toast.error(err.response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            this.setState({ loadingimg: false })
            this.setState({ password: "" })
        })

    }

    logoutCustomer = () => {
        this.setState({ token: "" });
    }

    render() {
        return (
            <React.Fragment>
                <ToastContainer />
                <h4>Checkout</h4>
                <div className="page">
                    <div className="main-content">
                        <div className="shippingform">
                            {!this.state.token ? (
                                <>
                                    <div className="input-box">
                                        <label>Email Address</label>
                                        <input type="text" class="email" name="email" value={this.state.username} onInput={this.checkIfEmailExist.bind(this)} />
                                    </div>
                                    {this.state.loadingimg && (
                                        <div class="loaderimg"><img width="64" height="64" src={loadingimg} /></div>
                                    )}
                                    {!this.state.email && (
                                        <React.Fragment>
                                            <div className="input-box">
                                                <label>Password</label>
                                                <input type="password" class="password" name="password" value={this.state.password} onInput={this.handlePassword.bind(this)} />
                                            </div>
                                            <button class="update login" onClick={() => this.loginCustomer()}><span>Login</span></button>
                                        </React.Fragment>
                                    )}
                                </>
                            ) : (
                                    <React.Fragment>
                                        <ul class="address">
                                            {console.log(this.state.cart)}
                                            {this.state.cart && this.state.addresses.map(address=>(

                                                <li  className={address.default_shipping && 'active'} key={address.id} onClick={()=>this.setShippingAddress(address.id)}>
                                                   <span className={address.default_shipping && 'tick'}></span>
                                                    <span>{address.firstname} {address.lastname}</span>
                                                    <span>{address.street.join(', ')}</span>
                                                    <span>{address.city}</span>
                                                    <span>{address.region.region}</span>
                                                    <span>{address.postcode}</span>
                                                    <span>{address.telephone}</span>
                                                    
                                                </li>
                                            ))}
                                       </ul>
                                    <button class="update login" onClick={() => this.logoutCustomer()}><span>Logout</span></button>
                                    </React.Fragment>
                                )}
                               
                        </div>
                        <div class="checkoutMethods">
                                    <span>Shipping Methods</span>
                                </div>
                    </div>

                    <div className="right-content">
                    </div>

                </div>
            </React.Fragment>
        )
    }

}
export default Checkout;