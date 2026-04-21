import type {TenderFlowRepository} from '../domain/tenderflow';
import {createTenderFlowApiRepository} from './tenderFlowApiRepository';

export const tenderFlowRepository: TenderFlowRepository = createTenderFlowApiRepository();
