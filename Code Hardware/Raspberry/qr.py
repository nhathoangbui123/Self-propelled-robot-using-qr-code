import cv2
import numpy as np
import pyzbar.pyzbar as qr
import serial
import pyrebase

cap=cv2.VideoCapture(0)
font = cv2.FONT_HERSHEY_PLAIN

ser = serial.Serial(
         port = '/dev/ttyUSB0',
         baudrate = 115200,
         parity = serial.PARITY_NONE,
         stopbits = serial.STOPBITS_ONE,
         bytesize = serial.EIGHTBITS,
         timeout=1
)

config = {
  "apiKey": "AIzaSyAULD_5XOVsrub8anXNRIQkPdOEX8Z1Qjw",
  "authDomain": "project2-b7d1e.firebaseapp.com",
  "databaseURL": "https://project2-b7d1e-default-rtdb.firebaseio.com",
  "storageBucket": "project2-b7d1e.appspot.com"
};
firebase = pyrebase.initialize_app(config)
while True:
      database = firebase.database()
      position=database.child("Robot")
      
      ret,frame = cap.read()
      flipped = cv2.flip(frame, flipCode=-1)
      frame1=cv2.resize(flipped,(640,480))
      qrdetect=qr.decode(frame1)
      
      for i in qrdetect:
          print (i.rect.left,i.rect.top,i.rect.width,i.rect.height)
          print (i.data)
          strvalue = i.data.decode('utf-8')
          position.child("robot").set(strvalue)
          
          ser.write(i.data)
          
          cv2.rectangle(frame1,(i.rect.left,i.rect.top),(i.rect.left+i.rect.width,i.rect.top+i.rect.height),(0,255,0),3)
          cv2.putText(frame1,str(i.data),(20,20),font,2,(255,0,0),2)
      cv2.imshow("QR Code Detection", frame1)
      key = cv2.waitKey(1) & 0xFF
      if key == ord("q"):
         break
        