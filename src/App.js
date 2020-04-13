import React, { useState, useEffect } from "react";
import "./App.css";
import SearchBoxMui from "./SearchBoxMUI";
import AnswerList from "./AnswerList";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Links from "./Links";
import LocationIcon from "@material-ui/icons/PinDrop";
import LocationNIcon from "@material-ui/icons/GpsNotFixedOutlined";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import BackIcon from "@material-ui/icons/ArrowBack";
import HelpIcon from "@material-ui/icons/HelpOutline";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FAQ from "./FAQ.js";
import { hostname } from "./config";
import Stats from "./Stats";
import { geolocated } from "react-geolocated";
import Footer from "./Footer";
import MapLocate from "./MapLocate";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { getAddressFrom } from "./utils";
import Header from "./Header";
import { Fab } from "@material-ui/core";

function App({
  coords,
  isGeolocationAvailable, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError, // object with the error returned from the Geolocation API call
}) {
  const [question, setQuestion] = useState({
    question: "",
    answer: [],
    answerMode: false,
  });

  const [openMap, setOpenMap] = useState(false);
  const [mylocation, setMyLocation] = useState(null);

  useEffect(() => {
    if (mylocation == null && coords !== null)
      setMyLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      });
  }, [coords]);
  useEffect(() => {
    if (positionError)
      fetch(`https://location.services.mozilla.com/v1/geolocate?key=test`)
        .then((res) => res.json())
        .then((res) => {
          setMyLocation({
            latitude: res.location.lat,
            longitude: res.location.lng,
            accuracy: res.accuracy,
          });
        })
        .catch((err) => {
          setMyLocation({
            latitude: 0,
            longitude: 0,
            accuracy: 200000,
          });
        });
  }, [positionError]);

  return (
    <>
      <CoronaBackground question={question} units={10}>
        {mylocation !== null && (
          <MapLocate
            page="home"
            currentLocation={mylocation}
            open={openMap}
            onEncodedLocation={(resolvedAddress) => {
              let address = getAddressFrom(resolvedAddress);
              setMyLocation({
                ...mylocation,
                addressComponent: address,
              });
            }}
            locationUpdate={(pos) => {
              console.log("update", pos);
              let address = getAddressFrom(pos.resolvedAddress);
              setMyLocation({
                ...mylocation,
                latitude: pos.latitude,
                longitude: pos.longitude,
                addressComponent: address,
              });
            }}
            onClose={() => {
              setOpenMap(false);
            }}
          />
        )}
        <div class="layout-center">
          <Header type="normal" active="Information"/>
          <div class="header-location">
            <Button
              disabled={!mylocation}
              size="small"
              color="primary"
              gutterBottom
              startIcon={<LocationIcon />}
              onClick={()=>{
                setOpenMap(true);
              }}
            >
              {mylocation ? `Update Location` : "Locating..."}
            </Button>
            <Typography variant="caption" component="div" className="location">
              {mylocation?.addressComponent
                ? `${
                    mylocation.addressComponent.formattedAddress
                      ? mylocation.addressComponent.formattedAddress
                      : "No address found"
                  }`
                : ""}
            </Typography>
          </div>

          <div class="stats-wrapper">
            <Stats
              initialFilter={
                mylocation && mylocation.addressComponent
                  ? mylocation.addressComponent
                  : {}
              }
            />
          </div>
          <SearchBox
            onFetchingAnswer={(question) => {
              console.debug("got question", question);
              setQuestion({
                question,
                answer: [],
                answerMode: true,
              });
            }}
            onAnswer={(answer) => {
              console.debug("got answer", answer);
              setQuestion({ ...answer, answerMode: true });
            }}
          />
        </div>
        <Card className="card-transparent" elevation={0}>
          <CardContent>
            {question.answerMode ? (
              <div class="answer">
                <Button
                  startIcon={<BackIcon size="small" />}
                  size="small"
                  onClick={() => {
                    setQuestion({
                      question: "",
                      answer: [],
                      answerMode: false,
                    });
                  }}
                >
                  Back to FAQ
                </Button>
                <Answer
                  question={question}
                  clearQuestion={() => {
                    setQuestion(null);
                  }}
                />
              </div>
            ) : (
              <>
                <FAQ />
              </>
            )}
          </CardContent>
        </Card>
      </CoronaBackground>
      <Footer />
    </>
  );
}

const CoronaBackground = ({ children, units = 10 }) => {
  let background = children;
  for (let i = 0; i < units; i++) {
    background = (
      <div
        class="corona-bg"
        style={{
          animationDuration: ((40 + i * 10) % 90) + 60 + "s",
          backgroundPositionX: Math.random() * 100 + "%",
          backgroundPositionY: Math.random() * 100 + "%",
          animationName: "move-" + i,
        }}
      >
        <style>{`
            @keyframes move-${i} {
                 ${10}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${20}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${30}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${40}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${50}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${60}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${70}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${80}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${90}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
                 ${100}% {  background-position: ${Math.random() * 100}% ${
          Math.random() * 100
        }%;}
            }
        `}</style>
        {background}
      </div>
    );
  }
  return background;
};

function getHighlightedText({ Highlights, Text }) {
  var start = Highlights[0];
  if (!start) return Text;
  var end = Highlights[Highlights.length - 1];
  var text = Text.substr(0, start.BeginOffset);
  Highlights.shift();
  for (var i = start.BeginOffset; i <= end.EndOffset; i++) {
    if (i == start.BeginOffset) {
      text += `<span class="highlight-answer">`;
    } else if (i == start.EndOffset) {
      text += `</span>`;
      start = Highlights.shift();
      if (!start) {
        text += Text.substr(i);
        break;
      }
    }
    text += Text[i];
  }
  return text;
}
const getAnswer = async (question) => {
  return await fetch(`${hostname}/query?q=${question}`)
    .then((res) => res.json())
    .then((res) => {
      var faq = [];
      var answers = [];
      var documents = [];
      var duplicateHash = {};
      res.forEach((answer) => {
        var url = null;
        var answerType = answer.Type;
        if (answer) {
          if (
            !answer.DocumentURI.startsWith("https://s3.us-east-1.amazonaws.com")
          ) {
            url = answer.DocumentURI;
          }

          var formattedAnswer = answer.AdditionalAttributes.find(
            (x) => x.Key == "AnswerText"
          );
          var questionofFAQ = answer.AdditionalAttributes.find(
            (x) => x.Key == "QuestionText"
          );
          if (formattedAnswer) {
            var valueType = formattedAnswer.ValueType.toLowerCase()
              .split("_")
              .reduce((r, i) => {
                i = i[0].toUpperCase() + i.substr(1);
                return r + i;
              }, "");
            var hightlightText = getHighlightedText(
              formattedAnswer.Value[valueType]
            );
            questionofFAQ = questionofFAQ
              ? questionofFAQ.Value[valueType].Text
              : null;
            answer = hightlightText;
          } else {
            var hightlightText = getHighlightedText(answer.DocumentExcerpt);
            answer = hightlightText;
          }
        } else {
          answer = [{ cur: "No answer found." }];
        }
        if (duplicateHash[answer]) {
          return;
        } else {
          duplicateHash[answer] = true;
        }
        var ans = { text: answer, url, faqQuestion: questionofFAQ };
        switch (answerType) {
          case "QUESTION_ANSWER":
            faq.push(ans);
            break;
          case "ANSWER":
            answers.push(ans);
            break;
          default:
            documents.push(ans);
            break;
        }
      });

      return {
        question,
        answer: [...faq, ...answers, ...documents],
      };
    });
};

const SearchBox = ({ onFetchingAnswer, onAnswer }) => {
  return (
    <div class="search">
      <SearchBoxMui
        searchThis={(question) => {
          if (question == "") return;
          onFetchingAnswer(question);
          getAnswer(question).then(onAnswer);
        }}
      />
    </div>
  );
};

function isSameText(a, b) {
  if (!Boolean(a) || !Boolean(b)) return false;
  a = a
    .toLowerCase()
    .match(/[a-z]+/g, "")
    .join("");
  b = b
    .toLowerCase()
    .match(/[a-z]+/g, "")
    .join("");
  return a == b;
}
const Answer = ({ question }) => {
  var answerList = question.answer.map((x, i) => ({
    title: `Result ${i + 1}`,
    description: x.text,
    action: [x.url],
    isSameQuestion: isSameText(x.faqQuestion, question.question),
    faqQuestion: x.faqQuestion,
  }));
  return (
    <>
      <div class="answer-title">
        <Typography
          variant="subtitle1"
          component="h2"
          gutterBottom={true}
          align={"center"}
          color="primary"
        >
          {question.question}
        </Typography>
        {question.question && (
          <Typography
            style={{
              color: "#7b7b7b",
            }}
            variant="caption"
            component="div"
            gutterBottom={true}
            align={"center"}
          >
            {answerList.length == 0
              ? "Finding answer..."
              : `Total ${answerList.length} Answers Found`}
          </Typography>
        )}
      </div>
      <AnswerList list={answerList} />
    </>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity,
  },
  watchPosition: false,
  userDecisionTimeout: null,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation,
  isOptimisticGeolocationEnabled: true,
})(App);
