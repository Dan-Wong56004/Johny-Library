import React, { useEffect, useContext, useReducer, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { ResourceRev } from "../types/resource";
import { RoomBookingInfo } from "../types/room";
import { fetchReservationByUserID } from "../api/fetchResource/fetchResource";

interface ContextType extends State {
  getAccountDetails: () => void;
}

const AccountDetailContext = createContext<ContextType | undefined>(undefined);

interface State {
  reservations: ResourceRev[];
  roomBookingRecord: RoomBookingInfo[];
  error: string;
}

type Action =
  | { type: "reservations/loaded"; payload: ResourceRev[] }
  | { type: "roomBookingRecords/loaded"; payload: RoomBookingInfo[] }
  | { type: "rejected"; payload: string };

const initialState = {
  reservations: [] as ResourceRev[],
  roomBookingRecord: [] as RoomBookingInfo[],
  error: "",
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "reservations/loaded":
      return {
        ...state,
        reservations: action.payload,
      };
    case "roomBookingRecords/loaded":
      return {
        ...state,
        roomBookingRecord: action.payload,
      };
    case "rejected":
      return {
        ...state,
        reservations: [] as ResourceRev[],
        roomBookingRecord: [] as RoomBookingInfo[],
        error: action.payload,
      };
    default:
      throw new Error("unknown action");
  }
}

export default function AccountDetailsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  async function getAccountDetails() {
    if (isAuthenticated && user && user.sub) {
      const accessToken = await getAccessTokenSilently();
      try {
        const res = await fetchReservationByUserID(user.sub, accessToken);
        dispatch({ type: "reservations/loaded", payload: res });

        // add fetching room booking record by userID here

        //const room = await fetchRoomBookingByUserID(user.sub, accessToken);
        //dispatch({ type: "reservations/loaded", payload: room });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "rejected",
          payload: "Error loading Account Details",
        });
        throw error;
      }
    } else {
      dispatch({ type: "rejected", payload: "not authenticated" });
    }
  }

  useEffect(() => {
    getAccountDetails();
  }, [isAuthenticated, user]);
  return (
    <AccountDetailContext.Provider
      value={{
        reservations: state.reservations,
        roomBookingRecord: state.roomBookingRecord,
        error: state.error,
        getAccountDetails: getAccountDetails,
      }}
    >
      {children}
    </AccountDetailContext.Provider>
  );
}

function useAccountDetails() {
  const context = useContext(AccountDetailContext);
  if (!context) throw new Error("outside provider");
  return context;
}

export { useAccountDetails };
