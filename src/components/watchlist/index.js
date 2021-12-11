import React, { useState, useContext, createContext, useEffect } from 'react';
import { Button, Container } from './styles/watchlist';
import { FirebaseContext } from '../../context/firebase';
import 'firebase/database'
import { FeatureContext } from '../card';

export const WatchListContext = createContext();

export default function WatchList({ children, ...restProps }) {
  const [add, setAdd] = useState(false);
  const [watchList, setWatchList] = useState([])
  const { showFeature, itemFeature } = useContext(FeatureContext);
  const [data, setData]  = useState([])
  const [watchId, setWatchId] = useState([])
  const { firebase } = useContext(FirebaseContext);
  const user = firebase.auth().currentUser || {};

  useEffect(() => {
      var starCountRef = firebase.database().ref('watchlist/' + user.uid);
      starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if(data){
          console.log('xsvs',data)
          setData(data)
      }
      });
  },[])

  useEffect(() => {
    if(data.length == 0) return
    if(data){
        let {watchId= []} = data
        setWatchId(watchId)     
    }
  },[data])

  

  useEffect(() => {
    if(add){
        if(data.length == 0){
            console.log("my data")
            firebase.database().ref('watchlist/' + user.uid).set({
                userId: user.uid,
                watchId: [itemFeature.id]
              }, (error) => {
                if (error) {
                  // The write failed...
                    console.log(error)
                } else {
                  // Data saved successfully!
                  console.log("data saved")
                }
              });
        }

        else{
            let watchIdArray = watchId
            watchIdArray = watchIdArray.filter( item => {
              return item.id != itemFeature.id   
            })
            if(watchIdArray.length > 0){
                watchIdArray.push(itemFeature.id)
            }
            console.log('my watchs',watchIdArray)
            var ref = firebase.database().ref('/watchlist/' + user.uid);
            ref.once('value').then(function (snapshot) {
            return ref.update({
                userId: user.uid,
                watchId: watchIdArray
            });
            });
        }
    }
    
},[add])



console.log('my obj',watchList)
  return (
    <WatchListContext.Provider value={{ add, setAdd }}>
      <Container {...restProps}>{children}</Container>
    </WatchListContext.Provider>
  );
}

WatchList.Button = function WatchList({ children, category, ...restProps }) {
    const { add, setAdd } = useContext(WatchListContext);
//   if(add){
//     for(let obj in watchListObj){
//         if(watchListObj[obj]['userId'] == user.uid){
//             watchListObj[obj]['watchIds'] = [...watchListObj[obj]['watchIds'],itemFeature.id]
//             return;
//         }
//     }
//     watchListObj['userId']= user.uid
//     watchListObj['watchIds'].push(itemFeature.id)
//   }

  return (  
    <Button onClick={() => {setAdd(true)}}>Add To WatchList</Button>
  ) 
};
