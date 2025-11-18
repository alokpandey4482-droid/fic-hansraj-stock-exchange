// app/api/auth/register/route.js
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request) {
  const { email, password, isLogin } = await request.json();

  try {
    let userCredential;
    if (isLogin) {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    }
    return Response.json({ success: true, user: userCredential.user });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 });
  }
}