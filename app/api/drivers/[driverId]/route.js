import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

import { AUTH_ERROR_MESSAGE, isAdmin } from "../../utils";

const driversRef = collection(db, "drivers");

// Get a single driver
export async function GET(request, { params }) {
  const userAPIKey = headers().get("authorization");
  if (await isAdmin(userAPIKey)) {
    const docRef = doc(db, "drivers", params.driverId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ data: docSnap.data(), status: true });
    } else {
      return NextResponse.json({ error: `${params.driverId} does not exist` });
    }
  } else {
    return NextResponse.json({ data: AUTH_ERROR_MESSAGE, status: false });
  }
}

// Update a single driver
export async function PUT(request, { params }) {
  const userAPIKey = headers().get("authorization");
  if (await isAdmin(userAPIKey)) {
    const driver = params.driverId;
    const docRef = doc(db, "drivers", driver);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const res = await request.json();
      const updatedDriver = await setDoc(doc(driversRef, driver), {
        id: driver,
        primary_bus_assigned: res.primary_bus_assigned,
        driver_license_number: res.driver_license_number,
        full_name: res.full_name,
        profile_photo_url: res.profile_photo_url,
      });

      return NextResponse.json({
        data: `driver ${driver} updated successfully`,
        status: true,
      });
    } else {
      return NextResponse.json({
        error: `driver ${driver} does not exist`,
      });
    }
  } else {
    return NextResponse.json({ data: AUTH_ERROR_MESSAGE, status: false });
  }
}

// Delete a driver
export async function DELETE(request, { params }) {
  const userAPIKey = headers().get("authorization");
  if (await isAdmin(userAPIKey)) {
    const driver = params.driverId;
    const res = await deleteDoc(doc(db, "drivers", driver));

    return NextResponse.json({
      data: `driver ${driver} deleted successfully`,
      status: true,
    });
  } else {
    return NextResponse.json({ data: AUTH_ERROR_MESSAGE, status: false });
  }
}
