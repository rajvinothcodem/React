import React from 'react';
import axios from 'axios';
const maskId = localStorage.getItem('quote');
const token = "Bearer 8pla3f6k12yjwowscbel5pbltgu7n38n";
const customerToken = "Bearer "+maskId;
export function getCart() {
    const promise = (maskId.length > 32) ?  axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine`, { headers: { Authorization: `${customerToken}` } }) : 
                    axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}`)
    const dataPromise = promise.then((response) =>  {
        if(maskId.length > 32)
        {
            localStorage.setItem('cart',response.data.id);
            let address = response.data.customer.addresses.filter(y=>y.default_shipping==true)[0];
            localStorage.setItem('address',JSON.stringify(address));
            return response.data
        }else{
            localStorage.removeItem("address");
            return response.data
        }   
    });
    return dataPromise;
}
export function getItemImage(sku) {
    const promise = axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/products/${sku}`, { headers: { Authorization: `${token}` } });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}
export function collectTotals() {
    const promise = (maskId.length > 32) ? axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/totals`, { headers: { Authorization: `${customerToken}` } }) : 
                    axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/totals`);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}
export function removeItem(itemId) {
    const promise = (maskId.length > 32) ? axios.delete(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/items/${itemId}`, { headers: { Authorization: `${customerToken}` } }) : 
                    axios.delete(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/items/${itemId}`);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}
export function applyCouponcode(couponCode) {   
    const promise = (maskId.length > 32) ? axios.put(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/coupons/${couponCode}`,{},{ headers: { Authorization: `${customerToken}` } }) :
                    axios.put(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/coupons/${couponCode}`);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}
export function deleteCouponcode() {
    const promise = (maskId.length > 32) ? axios.delete(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/coupons`,{ headers: { Authorization: `${customerToken}` } }): 
                    axios.delete(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/coupons`);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}
export function updateShoppingCart(cartItem)
{   
    const promise = (maskId.length > 32) ? axios.put(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/items/${cartItem.item_id}`,{"cartItem":cartItem},{ headers: { Authorization: `${customerToken}` } }): 
    axios.put(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/items/${cartItem.item_id}`,{"cartItem":cartItem});
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}
export function getCountries(){
    
    const promise = axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/directory/countries`, { headers: { Authorization: `${token}` } });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

export function getRegions(countryId){
    const promise = axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/directory/countries/${countryId}`, { headers: { Authorization: `${token}` } });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

export function getEsShipping(address){
    const promise = (maskId.length > 32)? axios.post(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/estimate-shipping-methods`,{"address":address},{ headers: { Authorization: `${customerToken}` } })
                    : axios.post(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/estimate-shipping-methods`,{"address":address});
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

export function applyShippingMethod(addressInformation)
{
const promise = (maskId.length > 32)? axios.post(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine/shipping-information`,{"addressInformation":addressInformation},{ headers: { Authorization: `${customerToken}` } })
                 : axios.post(`${process.env.REACT_APP_MAGENTO_URL}default/V1/guest-carts/${maskId}/shipping-information`,{"addressInformation":addressInformation});
const dataPromise = promise.then((response) => response.data);
return dataPromise;
}

export function isEmailAvailable(email)
{
    const promise = axios.post(`${process.env.REACT_APP_MAGENTO_URL}default/V1/customers/isEmailAvailable`, {"customerEmail":email});
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

export function getCustomerToken(customer)
{
    const promise = axios.post(`${process.env.REACT_APP_MAGENTO_URL}default/V1/integration/customer/token`, customer);
    const dataPromise = promise.then((response) => response.data);
    return dataPromise;
}

export function getCustomerAddresses(cusToken)
{
    const promise = axios.get(`${process.env.REACT_APP_MAGENTO_URL}default/V1/carts/mine`, { headers: { Authorization: `Bearer ${cusToken}` } });
    const dataPromise = promise.then((response) => response.data);
    return dataPromise; 
}