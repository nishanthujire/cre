import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import RadioButtonRN from 'radio-buttons-react-native';
import * as SQLite from 'expo-sqlite';
//db creaion
const db = SQLite.openDatabase('db.cricketscoreDb') // returns Database object


export default function HomeScreen({ navigation }) {
  //hooks
  const [hostteam, setHostteam] = useState('Host Team');
  const [visitorteam, setVisitorteam] = useState('Visitor Team');
  const [tossvalue, setTossvalue] = useState();
  const [tosslostValue, setTosslostValue] = useState();
  const [optedvalue, setOptedvalue] = useState('bat');
  const [overs, setOvers] = useState('');
  const [teams_id, setTossTeams_id] = useState();





  useEffect(() => {
    createTable();
    //deleteTable();
  }, []);
  //teams and matches table creation 
  const createTable = () => {

    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS matches (match_id INTEGER PRIMARY KEY AUTOINCREMENT,team1 TEXT,team2 TEXT,toss TEXT,opted TEXT,overs INTEGER,' +
        'team1_run TEXT,team1_wicket TEXT,team1_overs TEXT,' +
        'team2_run TEXT,team2_wicket TEXT,team2_overs TEXT,' +
        'win_team TEXT,win_run TEXT,win_type TEXT)'
      )
    })
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS teams (team_id INTEGER PRIMARY KEY AUTOINCREMENT,team_name TEXT,total_matches INTEGER  DEFAULT 0,won INTEGER  DEFAULT 0,lost INTEGER  DEFAULT 0)'
      )
    })

  }

  //function to insert teams and matches data
  const insert = () => {
    //data validation
    if (!hostteam || !visitorteam || !tossvalue || !optedvalue || !overs) {
      alert('Please fill all the details.');
      return;
    }
    //inserting data into matches table

    db.transaction(tx => {
      tx.executeSql('INSERT INTO matches (team1,team2,toss,opted,overs) VALUES (?,?,?,?,?)', [hostteam, visitorteam, tossvalue, optedvalue, overs],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('inserted matches');
            //alert('inserted matches');
          }
        },
        (tx, error) => console.log('Error', error))
    });


    //checking host teams data exist or not in table
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM teams where team_name = ?", [hostteam],
        (tx, results) => {
          var len = results.rows.length;
          //console.log('len is ', len)

          if (len > 0) {
            console.log('host teams already exist')


          }
          else {
            //inserting host data into teams table
            db.transaction(tx => {
              tx.executeSql('INSERT INTO teams (team_name,total_matches,won,lost) values (?,?,?,?)', [hostteam, 0, 0, 0],
                (tx, results) => {

                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('inserted team 1');
                    //alert('inserted teams');
                  }
                },
                (tx, error) => console.log('Error', error))
            });
          }
        }
      )
    })

    //checking visitor teams data exist or not in table
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM teams where team_name = ?", [visitorteam],
        (tx, results) => {
          var len2 = results.rows.length;
          //console.log('len is ', len)

          if (len2 > 0) {
            console.log('visitorteam teams already exist')


          }
          else {
            //inserting host data into teams table
            db.transaction(tx => {
              tx.executeSql('INSERT INTO teams (team_name,total_matches,won,lost) values (?,?,?,?)', [visitorteam, 0, 0, 0],
                (tx, results) => {

                  console.log('Results', results.rowsAffected);
                  if (results.rowsAffected > 0) {
                    console.log('inserted team 2');
                    //alert('inserted teams');
                  }
                },
                (tx, error) => console.log('Error', error))
            });
          }
        }
      )
    })
    navigation.navigate('StartMatchScreen', {
      toss: tossvalue
    });

    // //fething team id

    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "SELECT team_id FROM teams where team_name = ?",
    //     [hostteam],
    //     (tx, results) => {
    //       var len = results.rows.length;
    //       console.log('len is ', len)

    //       if (len > 0) {
    //         var toss_id = results.rows.item(0).team_id;
    //         console.log("id is", toss_id)

    //         //sending data
    //         navigation.navigate('StartMatchScreen', {
    //           toss: tossvalue, toss_id: results.rows.item(0).team_id
    //         });




    //       }
    //     }
    //   )
    // })

   

  }
  //deleting data
  const deleteTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'delete from matches'
      )
    })
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Teams</Text>

      <TextInput
        style={styles.input}
        placeholder="Host Team"
        onChangeText={(value) => setHostteam(value)}

      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setVisitorteam(value)}
        placeholder="Visitor Team"
      />
      <Text style={styles.text}>Toss Won By ?</Text>
      <RadioButton.Group onValueChange={newValue => setTossvalue(newValue)} value={tossvalue}>
        <View style={styles.radiobutton}>

          <RadioButton color='green' value={hostteam} />
          <Text style={{ marginTop: 7 }}>{hostteam}</Text>
        </View>
        <View style={{ flexDirection: 'row', }}>

          <RadioButton color='green' value={visitorteam} />
          <Text style={{ marginTop: 7 }}>{visitorteam}</Text>
        </View>
      </RadioButton.Group>
      <Text style={styles.text}>Opted to ?</Text>
      <RadioButton.Group onValueChange={newValue => setOptedvalue(newValue)} value={optedvalue}>
        <View style={styles.radiobutton}>

          <RadioButton color='green' value="bat" />
          <Text style={{ marginTop: 7 }}>Bat</Text>
        </View>
        <View style={{ flexDirection: 'row', }}>

          <RadioButton color='green' value="bowl" />
          <Text style={{ marginTop: 7 }}>Bowl</Text>
        </View>
      </RadioButton.Group>
      <Text style={styles.text}>Overs?</Text>

      <TextInput
        style={styles.input}
        placeholder="16"
        keyboardType='numeric'
        onChangeText={(value) => setOvers(value)}
      />


      <View style={styles.buttoncontainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AdvancedSettings')}>
          <Text style={styles.advancedtext}   >Advanced Settings</Text>
        </TouchableOpacity >
        <Button
          color="green"
          title="Start match"

          onPress={insert}


        />


      </View>

    </View>





  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    padding: 10

  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: 'green',
    marginLeft: 10
  },
  input: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    padding: 10,
  },
  buttoncontainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  advancedtext: {
    marginTop: 5,
    fontSize: 15,
    marginLeft: 10
  },
  radiobutton: {
    marginBottom: 5,
    marginTop: 5,
    flexDirection: 'row',
  },

});