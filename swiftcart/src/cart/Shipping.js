import React from 'react'
import loader from './../page/images/loading-gif.gif';
import { getCountries, getRegions, getEsShipping, applyShippingMethod } from './Api';
import { ToastContainer, toast } from 'react-toastify';
class Shipping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            regions: [],
            isRegionAvailable: true,
            countryCode: "",
            regionCode: "",
            shippingMethods: [],
            shipLoader: false,
            zipCode: "",
            selectedMethod: "",
            regionId:""
        }
    }

    componentDidMount() {
        this.countries();
        if (Array.isArray(this.props.shippingAssignments)) {
            this.props.shippingAssignments.map(ship => {
                console.log("ship",ship);
                this.getCustomerShipping(ship.shipping.address);
                this.setState({selectedMethod:ship.shipping.method});
            });
            
        }
    }

    getCustomerShipping = (shippingAddr) => {
        if(shippingAddr.country_id !== null)
        {
            console.log(shippingAddr);
            this.setState({ shipLoader: true });
            getRegions(shippingAddr.country_id).then(response => {
                if (response.available_regions !== undefined) {
                    this.setState({ isRegionAvailable: true });
                    this.setState({ regions: response.available_regions });

                } else {
                    this.setState({ isRegionAvailable: false });
                }
                this.setState({ countryCode: shippingAddr.country_id });
                this.setState({ regionCode: (shippingAddr.region)? shippingAddr.region_code : ""});
                this.setState({ regionId: (shippingAddr.region)? shippingAddr.region_id : ""});
                this.setState({ zipCode: shippingAddr.postcode });
                let address;
                if(this.state.isRegionAvailable)
                {
                    address = {
                        "region_code": this.state.regionCode,
                        "region_id": this.state.regionId,
                        "country_id": this.state.countryCode,
                        "postcode": this.state.zipCode
                    }
                }else{
                    this.setState({ regionCode: (shippingAddr.region)? shippingAddr.region : ""});
                    address = {
                        "region": shippingAddr.region,
                        "country_id": this.state.countryCode,
                        "region_id": this.state.regionId,
                        "postcode": this.state.zipCode
                    }
                }
                
                this.estimateShipping(address);
            })
        }

    }

    countries = () => {
        let allcountries = [];
        getCountries().then(response => {
            response.map(data => {
                allcountries.push({
                    "label": data.full_name_locale,
                    "value": data.two_letter_abbreviation
                })
            })
            this.setState({ countries: allcountries });
            
        }).catch(err => console.log(err));
    }

    handleChange(e) {
        this.setState({ shipLoader: true });
        let countryId = e.target.value;
        if (countryId !== "") {
            getRegions(countryId).then(response => {
                if (response.available_regions !== undefined) {
                    this.setState({ isRegionAvailable: true });
                    this.setState({ regions: response.available_regions });

                } else {
                    this.setState({ isRegionAvailable: false });
                }
                this.setState({ countryCode: countryId });
                this.setState({ loader: false })
            })
        } else {
            this.setState({ isRegionAvailable: true });
            this.setState({ countryCode: "" });
        }
        this.setState({ regionCode: "" });
        this.setState({ zipCode: "" });
        let address;
        if(this.state.isRegionAvailable)
        {
            address = {
                "region_code": this.state.regionCode,
                "country_id": countryId,
                "postcode": this.state.zipCode
            }
        }else{
            address = {
                "region": this.state.regionCode,
                "country_id": countryId,
                "postcode": this.state.zipCode
            }
        }
       
        this.estimateShipping(address);
    }

    handleRegion(event) {
        let regionIdentifier = "";
        let address;
        if (event.target.value !== "") {
            this.setState({ regionCode: event.target.value });
            if(event.target.options !== undefined)
            {
                const selectedIndex = event.target.options.selectedIndex;
                regionIdentifier = event.target.options[selectedIndex].getAttribute('data-regionid')
                this.setState({regionId: regionIdentifier});
            }else{
                this.setState({regionId:  event.target.value});
            }


        } else {
            this.setState({ regionCode: "" });
            this.setState({ regionId: regionIdentifier });
        }
        this.setState({ zipCode: "" });
        this.setState({ shipLoader: true });
        if(this.state.isRegionAvailable)
        {
            address = {
                "region_code": event.target.value,
                "region_id": regionIdentifier,
                "country_id": this.state.countryCode,
                "postcode": this.state.zipCode
            }
        }else{
            address = {
                "region": event.target.value,
                "country_id": this.state.countryCode,
                "postcode": this.state.zipCode
            }
        }
       
       
        this.estimateShipping(address);

    }

    handleInput(event) {
        let address;
        this.setState({ shipLoader: true });
        this.setState({ zipCode: event.target.value });
        if(this.state.isRegionAvailable)
        {
             address = {
                "region_code": this.state.regionCode,
                "region_id": this.state.regionId,
                "country_id": this.state.countryCode,
                "postcode": event.target.value
            }
        }else{
             address = {
                "region": this.state.regionCode,
                "country_id": this.state.countryCode,
                "postcode": event.target.value
            }
        }
        this.estimateShipping(address);

    }

    estimateShipping = (address) => {
        getEsShipping(address).then(response => {

            this.setState({ shippingMethods: response });
            this.setState({ shipLoader: false });
        }).catch(err => console.log(err));

    }

    updateShippingMethod(e) {
        let addressInformation;
        this.setState({shipLoader: true});
        let method = e.target.value;
        let fields = method.split('_');
        addressInformation = {
            "shipping_address": 
            {
                "region": this.state.regionCode,
                "country_id": this.state.countryCode,
                "postcode": this.state.zipCode
            },
            "shipping_method_code": fields[1],
            "shipping_carrier_code": fields[0]
        }
        
        if(this.state.isRegionAvailable)
        {
             addressInformation = {
                "shipping_address": 
                {
                    "region_code": this.state.regionCode,
                    "region_id":this.state.regionId,
                    "country_id": this.state.countryCode,
                    "postcode": this.state.zipCode
                },
                "shipping_method_code": fields[1],
                "shipping_carrier_code": fields[0]
            }
        }else{
             addressInformation = {
                "shipping_address": 
                {
                    "region": this.state.regionCode,
                    "country_id": this.state.countryCode,
                    "postcode": this.state.zipCode
                },
                "shipping_method_code": fields[1],
                "shipping_carrier_code": fields[0]
            }
        }
        
        applyShippingMethod(addressInformation).then(response => {
           this.props.totals(response.totals);
           this.setState({ shipLoader: false });
           toast.success("Shipping information updated", {
            position: toast.POSITION.TOP_CENTER
           });

        }).catch(err => console.log(err));
        this.setState({ selectedMethod: method })
       
    }

    render() {
        return (
            <div class="estimate-shipping">
                <h4>Estimate Shipping & Tax</h4>
                <span>Country</span>
                <select name="countries" onChange={this.handleChange.bind(this)} value={this.state.countryCode} >
                    <option value="">Select Country</option>
                    {this.state.countries.map(country =>

                        <option key={country.value} value={country.value}>{country.label}</option>
                    )}
                </select>
                <span>State/Province</span>
                {this.state.isRegionAvailable ? (
                    <select name="regions" onChange={this.handleRegion.bind(this)} value={this.state.regionCode}>
                        <option value="">Select Region</option>
                        {this.state.regions.map(region =>

                            <option key={region.id} data-regionid={region.id} value={region.code}>{region.name}</option>
                        )}
                    </select>
                ) : (
                    <input placeholder="Select Region" value={this.state.regionCode} type="text" class="region" name="region" onInput={this.handleRegion.bind(this)} />
                )}
                <span>Zip/Postal Code</span>
                <input placeholder="Enter zip/postal code" value={this.state.zipCode || ''} type="text" class="zip" onInput={this.handleInput.bind(this)} name="zip" />
                {this.state.shippingMethods && (
                    <dl className="shippingMethods">
                        {this.state.shippingMethods.map((method, index) =>
                            <React.Fragment key={method.method_code}>
                                <dt>
                                    <span>{method.carrier_title}</span>
                                </dt>
                                <dd>
                                    <input onChange={this.updateShippingMethod.bind(this)} type="radio" class="radio" name="method_7" value={`${method.carrier_code}_${method.method_code}`} checked={this.state.selectedMethod === `${method.carrier_code}_${method.method_code}`} />
                                    <label>{method.method_title} <span>${method.amount}</span></label>
                                </dd>
                            </React.Fragment>
                        )}
                    </dl>
                )
                }
                {this.state.shipLoader && (
                    <div className="shipLoader"><img src={loader} width="50" /></div>
                )}
            </div>
        )
    }
}
export default Shipping;
