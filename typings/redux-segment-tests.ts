/// <reference path="redux-segment.d.ts" />
import { IGroupTraits, IGroupEventPayload } from 'redux-segment'; 

let traits:IGroupTraits = {
    id: '007',
    name: 'MI6'
}

let payload:IGroupEventPayload = {
    groupId: 'HMSS',
    traits: traits
}