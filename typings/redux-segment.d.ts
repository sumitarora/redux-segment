// Type definitions for redux-segment v0.7.2
// Project: https://github.com/rangle/redux-segment
// Definitions by: Derek Strickland <https://github.com/DerekStrickland>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace ReduxSegment {
    /**
     * Creates the tracker middleware for injection like so:
     *  compose(applyMiddleware(thunkMiddleware, loggerMiddleware, trackerMiddleware);
     */
    function createTracker():any;
    
    /**
     * Convenience string enum for configuring segment event types. Consolidates magic strings.
     */
    interface IEventTypes {
        /**
         * The identify call ties a customer and their actions to a recognizable ID and traits like their email, name, etc. 
         */
        identify:string;
        /**
         * The page call lets you record whenever a user sees a page of your website, along with any properties about the page.
         */
        page:string;
        /**
         * The track call is how you record any actions your users perform, along with any properties that describe the action.
         */
        track:string;
        /**
         * The alias method is used to merge two user identities, effectively connecting two sets of user data as one.
         */
        alias:string;
        /**
         * The group API call is how you associate an individual user with a group—be it a company, organization, account, project, team or whatever other crazy name you came up with for the same concept!
         */
        group:string
    }
    
    const EventTypes:IEventTypes;
    
    /**
     * A map of attributes about the user. These are completely at your discretion but common ones include email and name. If you don't provide a userId, the traits will be attributed to the currently identified users (whether anonymous or not).
     */
    interface IUserTraits {
        address?:any;
        age?:number;
        avatar?:string;
        birthday?:Date;
        createdAt?:Date;
        description?:string
        email?:string;
        firstName?:string;
        gender?:string;
        id?:string;
        lastName?:string;
        name?:string;
        phone?:string;
        title?:string;
        username?:string;
        website?:string;
    }
    
    interface IIdentifyEventPayload {
        /**
         * The database ID of the user. For anonymous visitors, an anonymousId will be automatically generated so this field can be omitted.
         */
        userId?:string;
        /**
         * A map of attributes about the user. 
         */
        traits?:IUserTraits;
        /**
         * A map of common fields (https://segment.com/docs/spec/common/#structure). This can be used to selectively enable or disable certain integrations or set anonymousId or userId on an ad-hoc basis.
         */
        options?:any;
    }
    
    interface IPageEventProperties {
        url?:string;
        title?:string;
        referrer?:string;
        path?:string;
        name?:string;
        search?:string
    }
    
    interface IPageEventPayload {
        /**
         * The name of the page (e.g. 'Home'). 
         */
        name:string;
        /**
         * The category of the page. This is used where page names live under a broader category (e.g. 'Products'). Note: If you specify a category, you must also provide a name.
         */
        category?:string;
        /**
         * A map of page properties. If not explicitly specified, the interface properties are implied. You can also provide your own custom properties by extending this interface.
         */
        properties?:IPageEventProperties;
        /**
         * A map of common fields (https://segment.com/docs/spec/common/#structure). This can be used to selectively enable or disable certain intergrations or set anonymousId or userId on an ad-hoc basis. More routinely, it is used to "backdate" events by setting the timestamp key to when the event actually occurred (as opposed to when the action * was dispatched). This is useful for cases where an action may be triggered after a significant wait (e.g. setTimeout, callback, animations, etc...) and you want to capture the time of human action instead of, say, the time at which that action was confirmed or some data was persisted.
         */
        options?:any
    }
    
    /**
     * A map of event properties. Properties are extra pieces of information tied to the event being tracked. They can help provide additional context later when analyzing the events, and in doing so, provide a more complete picture of what your users are doing.
     */
    interface ITrackEventProperties {
        
    }
    
    interface IMonetaryTrackEventProperties extends ITrackEventProperties {
        name?:string;
        revenue?:number;
        currency?:string;
        value?:number;
    }
    
    interface IExperimentTrackEventProperties extends ITrackEventProperties {
        experiment_id:string;
        experiment_name?:string;
        variation_id?:string;
        variation_name?:string;
    }
    
    interface IViewedProductCategoryEventProperties extends ITrackEventProperties {
        category:string;
    }
    
    interface IViewedProductEventProperties extends ITrackEventProperties {
        id?:string;
        sku?:string;
        name?:string;
        price?:string;
        category?:string;
    }
    
    interface IAddedOrRemovedProductEventProperties extends ITrackEventProperties {
        id?:string;
        sku?:string;
        name?:string;
        price?:string;
        quantity?:string;
        category?:string;
    }
    
    interface ICompletedOrderEventProperties extends ITrackEventProperties {
        orderId?:string;
        total?:number;
        revenue?:number;
        shipping?:number;
        tax?:number;
        discount?:number;
        coupon?:string;
        currency?:string;
        products?:Array<any>
    }
    
    //TODO: Handle TrackEvents magic strings. 
    
    interface ITrackEventPayload {
        /**
         * The name of the event you’re tracking. This field is required but if you don't explicitly provide one, it will be populated by the type value of the action*. It's recommended that you make event names human-readable and (hopefully) instantly recognizable. It's further recommended that * * these names be built from a past-tense verb and a noun (e.g. 'Bought Merchandise', 'Opened Cart', 'Favorited Product', etc...).
         */
        event:string;
        /**
         * A map of event properties. Properties are extra pieces of information tied to the event being tracked. They can help provide additional context later when analyzing the events, and in doing so, provide a more complete picture of what your users are doing.
         */
        properties: ITrackEventProperties
    }
    
    interface IAliasEventPayload {
        /**
         * The new database ID you want associated with the user.
         */
        userId:string;
        /**
         * The old ID of the user. If omitted, it's assumed to be the currently identified user’s ID (in the case of anonymous visitors, this is the auto-generated anonymousId).
         */
        previousId:string;
        /**
         * A map of common fields (https://segment.com/docs/spec/common/#structure). This can be used to selectively enable or disable certain integrations or set anonymousId or userId on an ad-hoc basis.
         */
        options?:any;
    }
    
    /**
     * A map of attributes about the group. These are completely at your discretion but common ones include employees and website.
     */
    interface IGroupTraits {
        address?:any;
        avatar?:string;
        createdAt?:Date;
        description?:string;
        email?:string;
        employees?:string
        id?:string;
        industry?:string;
        name?:string;
        phone?:string;
        website?:string;
    }
    
    interface IGroupEventPayload {
        /**
         * The new database ID of the group you want associated with the (identified or anonymous) user.
         */
        groupId:string;
        /**
         * A map of attributes about the group.
         */
        traits?:any;
        /**
         * A map of common fields (https://segment.com/docs/spec/common/#structure). This can be used to selectively enable or disable certain integrations or set anonymousId or userId on an ad-hoc basis.
         */
        options?:any;
    }
}

declare module "redux-segment" {
    export = ReduxSegment;
}

