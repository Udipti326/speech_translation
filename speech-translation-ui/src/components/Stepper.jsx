import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Check from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LanguageIcon from '@mui/icons-material/Language';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import SingleVideoUpload from './Upload';
import { CloudinaryContext, Video, Transformation } from "cloudinary-react";
import { DeleteForever } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import SoundBar from './SoundBar'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const languageOptions = [
    { code: 'af', name: 'Afrikaans' },
    { code: 'am', name: 'Amharic' },
    { code: 'ar', name: 'Arabic' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' },
    { code: 'ca', name: 'Catalan' },
    { code: 'cs', name: 'Czech' },
    { code: 'cy', name: 'Welsh' },
    { code: 'da', name: 'Danish' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'es', name: 'Spanish' },
    { code: 'et', name: 'Estonian' },
    { code: 'eu', name: 'Basque' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr-CA', name: 'French (Canada)' },
    { code: 'fr', name: 'French' },
    { code: 'gl', name: 'Galician' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ha', name: 'Hausa' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hr', name: 'Croatian' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'is', name: 'Icelandic' },
    { code: 'it', name: 'Italian' },
    { code: 'iw', name: 'Hebrew' },
    { code: 'ja', name: 'Japanese' },
    { code: 'jw', name: 'Javanese' },
    { code: 'km', name: 'Khmer' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ko', name: 'Korean' },
    { code: 'la', name: 'Latin' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ms', name: 'Malay' },
    { code: 'my', name: 'Myanmar (Burmese)' },
    { code: 'ne', name: 'Nepali' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pa', name: 'Punjabi (Gurmukhi)' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt-PT', name: 'Portuguese (Portugal)' },
    { code: 'pt', name: 'Portuguese (Brazil)' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'si', name: 'Sinhala' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sq', name: 'Albanian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'su', name: 'Sundanese' },
    { code: 'sv', name: 'Swedish' },
    { code: 'sw', name: 'Swahili' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tl', name: 'Filipino' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'yue', name: 'Cantonese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Mandarin/Taiwan)' },
    { code: 'zh', name: 'Chinese (Mandarin)' },
]

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
        ...theme.applyStyles('dark', {
            borderColor: theme.palette.grey[800],
        }),
    },
}));

const QontoStepIconRoot = styled('div')(({ theme }) => ({
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    '& .QontoStepIcon-completedIcon': {
        color: '#784af4',
        zIndex: 1,
        fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    ...theme.applyStyles('dark', {
        color: theme.palette.grey[700],
    }),
    variants: [
        {
            props: ({ ownerState }) => ownerState.active,
            style: {
                color: '#784af4',
            },
        },
    ],
}));

function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

QontoStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[700],
    }),
    variants: [
        {
            props: ({ ownerState }) => ownerState.active,
            style: {
                backgroundImage:
                    'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
                boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
            },
        },
        {
            props: ({ ownerState }) => ownerState.completed,
            style: {
                backgroundImage:
                    'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
            },
        },
    ],
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <CloudUploadIcon />,
        2: <LanguageIcon />,
        3: <OndemandVideoIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
};

const steps = ['Upload', 'Processing', 'Tadaaa!'];

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    lineHeight: '60px',
    padding: '2rem'
}));

const lightTheme = createTheme({ palette: { mode: 'light' } });

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const GradientButton = styled(Button)({
    background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
    borderColor: 'transparent',
    '&:hover': {
        background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
        borderColor: 'transparent',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
        borderColor: 'transparent',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
});


export default function CustomizedSteppers() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [video, setVideo] = React.useState("");
    const [language, setLanguage] = React.useState(null);
    const [translatedVideo, setTranslatedVideo] = React.useState("");

    const handleChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            if (!video) {
                toast.warn('Please upload a video', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                return
            }

            if (!language) {
                toast.warn('Please select a language', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                return;
            }

            const { name, code } = language;  // Extract language name and code

            console.log({ name, code })
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            // Send video URL and language details to backend
            const response = await fetch('http://localhost:5000/process-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    video_url: video,
                    language_name: name,
                    language_code: code,
                }),
            });

            const data = await response.json();
            // Handle the response, such as showing a link to the processed video
            console.log('Processed video URL:', data.video_url);
            setTranslatedVideo(data.video_url)
        } else if (activeStep === 2) {
            setVideo("")
            setLanguage("")
            setTranslatedVideo("")
            setActiveStep(0)
        }
    };

    React.useEffect(() => {
        if (translatedVideo && activeStep === 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }, [translatedVideo, activeStep]);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    // Handle video removal
    const handleRemoveVideo = () => {
        setVideo(null);
    };

    return (
        <div style={{ padding: '2rem 5rem' }} className="header">
            <ToastContainer />
            <Box sx={{ width: '100%' }}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <div className='center-absolute'>
                        <Grid container spacing={2} width='40vw' >
                            <Grid item xs={12} sx={{ padding: '0 !important' }}>
                                <ThemeProvider theme={lightTheme}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'transparent',
                                            display: 'grid',
                                            gridTemplateColumns: { md: '1fr' },
                                            gap: 2,
                                            height: 'auto'
                                        }}
                                    >
                                        <Item elevation={5} className='center'>
                                            {activeStep == 0 ? <>
                                                <SingleVideoUpload video={video} setVideo={setVideo} />
                                                <Box sx={{ minWidth: '30%', my: 1 }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Output Language</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={language}
                                                            label="Output Language"
                                                            onChange={handleChange}
                                                        >
                                                            {languageOptions.map((lang) => (
                                                                <MenuItem key={lang.code} value={lang}>
                                                                    {lang.name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <CloudinaryContext cloudName='dymsuaana' className="cloudinary_context">
                                                    {/* Uploaded video display */}
                                                    {video && (
                                                        <div className="video_preview">

                                                            <Video publicId={video} controls style={{ width: "300px" }}>
                                                                <Transformation width="300" crop="scale" />
                                                            </Video>
                                                            <IconButton onClick={handleRemoveVideo} style={{ marginTop: '10px' }}><DeleteForever /></IconButton>
                                                        </div>
                                                    )}
                                                </CloudinaryContext>
                                            </> : activeStep == 1 ?
                                                <>
                                                    This may take a while, please enjoy the music meanwhile
                                                    <br />
                                                    <SoundBar />
                                                </> :
                                                <>
                                                    <video controls width="320" height="180">
                                                        <source src={translatedVideo} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </>}
                                        </Item>
                                    </Box>
                                </ThemeProvider>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>

                            {activeStep != 1 && <GradientButton onClick={handleNext} variant="contained">
                                {activeStep === steps.length - 1 ? 'Translate Another Video' : 'Translate Video'}
                            </GradientButton>}
                        </Box>
                    </div>
                )}
            </Box>
        </div>
    );
}
