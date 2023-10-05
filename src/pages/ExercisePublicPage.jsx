import { useNavigate, useParams } from "react-router-dom";
import { retrievePublicExerciseById } from "../api/ExerciseApiService";
import { useEffect, useState } from "react";
import { followExercise } from "../api/UserApiService";
import { useAuth } from "../security/AuthContext";

export default function ExercisePublicPage(){

    const {exerciseId} = useParams();

    const {isAuthenticated, userId} = useAuth();

    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authorId, setAuthorId] = useState(null);
    const [authorUsername, setAuthorUsername] = useState("");
    const [functions, setFunctions] = useState([]);
    const [functionsPerformance, setFunctionsPerformance] = useState({});

    function setExerciseDetails(){
        retrievePublicExerciseById({exerciseId})
            .then((response) => {
                console.log(response);
                if(response.status != 200) navigate("/");
                setTitle(response.data.exerciseDetails.title);
                setDescription(response.data.exerciseDetails.description);
                setAuthorId(response.data.author.userId);
                setAuthorUsername(response.data.author.appUserDetails.username);
                setFunctions(response.data.functionsIncluded);
                setFunctionsPerformance(response.data.functionPerformance);

            })
            .catch((e) => {
                navigate("/");
            });
    }
    useEffect(setExerciseDetails, []);

    return (
        <div>
            {/* what do we need? 
                1. exercise details
                2. number of followers
                3. related functions and functions performance
                4. follow/unfollow button (in case of authorized user)  
                5. author*/
            }
            {showError && <div>Error</div>}
            <div className="exerciseDetails wrapper">
                <div className="block-component">
                    <div className="m-5">
                        <h3 className="m-2">{title}</h3>
                        <p className="m-2">Id: <b>{exerciseId}</b></p>
                    
                        <h5>Description</h5>
                        <p className="m-2">{description}</p>
                    </div>

                    <div className="m-2">
                        <h5>Author</h5>
                        <p>Id: <b>{authorId}</b></p>
                        <p>Username: <b>{authorUsername}</b></p>
                    </div>
                    
                    {/* Make follow/unfollow based on the request */}
                    {isAuthenticated &&
                        <button className="btn btn-success m-3" onClick={() => {
                            followExercise({userId, exerciseId}).then(response => {
                                if(response.status != 200){
                                    setShowError(true);
                                    return;
                                }
                                setShowError(false);
                            }).catch(e => {
                                console.log(e);
                                setShowError(true);
                            });
                        }}>Follow</button>
                    }

                </div>

                {functions && functions.length > 0 && 
                    <div className="block-component">
                        <h4 className="m-2">Functions included</h4>
                        {functions.map(func => {
                            return (
                                <div className="post" key={func.functionId} style={{marginBottom: "10px"}}>
                                    <h5>{func.functionDetails.title}</h5>
                                    <div className="m-2">ID: <b>{func.functionId}</b></div>
                                    <div className="m-2">Performance: <b>{functionsPerformance[func.functionId]}</b></div>
                                </div>
                            )
                        })}
                    </div>
                }

            </div>



        </div>
    );

}