import React, { useEffect, useState } from "react";

import useApi from "../hooks/useApi";
import typeWorksApi from "../api/typeWorks";
import typePhotosApi from "../api/typePhotos";
import workStatusApi from "../api/workStatus";
import inspectionsApi from "../api/inspections";
import publicWorksApi from "../api/publicWorks";
import usersApi from "../api/users";
import { Inspection } from "../screens/InspectionsScreen";
import { PublicWork } from "../screens/PublicWorksScreen";
import authStorage from "../auth/storage";

interface ISessionContext {
  typeWorks: any;
  typePhotos: any;
  workStatus: any;
  publicWorks: PublicWork[];
  inspections: Inspection[];
  error: any;
  loading: boolean;
  loadInspections: any;
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

  const loadDataFromServer = async () => {
    await loadTypeWorks();
    await loadWorkStatus();
    await loadTypePhotos();
    await loadPublicWorks();
    await loadInspections();
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
        error,
        loading,
        loadInspections,
        loadDataFromServer,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
