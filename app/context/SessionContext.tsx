import React, { useEffect, useState } from "react";

import useApi from "../hooks/useApi";
import typeWorksApi from "../api/typeWorks";
import typePhotosApi from "../api/typePhotos";
import workStatusApi from "../api/workStatus";
import inspectionsApi from "../api/inspections";
import publicWorksApi from "../api/publicWorks";
import photosApi from "../api/photos";
import collectsApi from "../api/collects";

export interface TypeWorks {
  flag: number;
  name: string;
  status_list?: number[];
}
export interface TypePhotos {
  flag: number;
  name: string;
  description: string;
}
export interface WorkStatus {
  flag: number;
  name: string;
  description: string;
}
export interface Address {
  id: string;
  street: string;
  neighborhood: string;
  number: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  cep: string;
  public_work_id: string;
}
export interface PublicWork {
  id: string;
  name: string;
  type_work_flag: number;
  user_status: number;
  // 0 = PENDENTE 1 = APROVADA 2 = REJEITADA 3 = EXCLUIDA
  queue_status: 0 | 1 | 2 | 3;
  queue_status_date: number;
  rnn_status: number;
  address: Address;
}

export interface Inspection {
  flag: number;
  name: string;
  inquiry_number: number;
  description: string;
  public_work_id: string;
  collect_id: string;
  // 0 = PENDENTE 1 = ATUALIZADA 2 = ENVIADA
  status: 0 | 1 | 2;
  user_email: string;
  request_date: number;
}
export interface Photos {
  id: string;
  collect_id: string;
  type: string;
  filepath: string;
  latitude: number;
  longitude: number;
  comment: string;
  timestamp: number;
}
export interface Collect {
  id: string;
  public_work_id: string;
  inspection_flag?: string;
  queue_status: number;
  queue_status_date: number;
  date: number;
  user_email: string;
  comments: string;
  public_work_status: number;
  photos?: string[];
}
interface ISessionContext {
  typeWorks: TypeWorks[];
  typePhotos: TypePhotos[];
  workStatus: WorkStatus[];
  publicWorks: PublicWork[];
  inspections: Inspection[];
  collects: Collect[];
  photos: Photos[];
  error: any;
  loading: boolean;
  loadInspections: any;
  loadPublicWorks: any;
  loadDataFromServer: any;
}

const SessionContext = React.createContext({} as ISessionContext);

const SessionProvider = ({ children }: { children?: React.ReactNode }) => {
  const {
    data: inspections,
    error,
    loading,
    request: loadInspections,
  } = useApi(inspectionsApi.getInspections);

  const { data: publicWorks, request: loadPublicWorks } = useApi(
    publicWorksApi.getPublicWorks
  );

  const { data: typeWorks, request: loadTypeWorks } = useApi(
    typeWorksApi.getTypeWorks
  );

  const { data: typePhotos, request: loadTypePhotos } = useApi(
    typePhotosApi.getTypePhotos
  );

  const { data: workStatus, request: loadWorkStatus } = useApi(
    workStatusApi.getWorkStatus
  );

  const { data: collects, request: loadCollects } = useApi(
    collectsApi.getCollects
  );

  const { data: photos, request: loadPhotos } = useApi(photosApi.getPhotos);

  const loadDataFromServer = async () => {
    await loadTypeWorks();
    await loadWorkStatus();
    await loadTypePhotos();
    await loadPublicWorks();
    await loadInspections();
    await loadCollects();
    await loadPhotos();
    // console.log(typeWorks);
    // console.log(workStatus);
    // console.log(typePhotos);
    // console.log(publicWorks);
  };

  useEffect(() => {
    loadDataFromServer();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        typeWorks,
        typePhotos,
        workStatus,
        publicWorks,
        inspections,
        collects,
        photos,
        error,
        loading,
        loadInspections,
        loadPublicWorks,
        loadDataFromServer,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
