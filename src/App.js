import { AppBar, Typography, Paper, Toolbar, Button, Grid, IconButton, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  },
  myLogo: {
    fontWeight: 1000
  },
  addBtn: {
    padding: 65,
    borderRadius: 25,
    backgroundColor: "#abeb34",
    "&:hover": {
      backgroundColor: "#abdb42"
    }
  },
  removeBtn: {
    backgroundColor: "#f44336",
    color: "white",
    height: 10,
    width: 10,
    "&:hover": {
      backgroundColor: "red"
    },
    position: "absolute",
    top: 15,
    left: 20
  },
  img: {
    maxHeight: "100%",
    maxWidth: "100%",
    opacity: 1,
    transition: "opacity 3s"
  },
  hidden: {
    opacity: 0
  },
  imgContainer: {
    position: "relative",
    height: 250
  },
}))

function App(props) {
  const classes = useStyles();

  const initalImages = [
    "https://i.pinimg.com/originals/33/b8/69/33b869f90619e81763dbf1fccc896d8d.jpg",
    "https://boardwalkaudio.com/wp-content/uploads/2017/03/cropped-Boardwalk-Audio-ICON.png",
    "https://static01.nyt.com/images/2014/08/10/magazine/10wmt/10wmt-superJumbo-v4.jpg",
    "https://static01.nyt.com/images/2016/05/11/us/12xp-instagram/12xp-instagram-articleLarge.jpg?quality=75&auto=webp&disable=upscale",
    "https://www.motortrend.com/uploads/sites/5/2021/01/Kia-Logo-2.png",
    "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nissan-brand-logo-1200x938-1594842787.jpg",
    "https://s.aolcdn.com/dims-global/dims3/GLOB/legacy_thumbnail/350x197/quality/95/https://s.aolcdn.com/os/ab/_cms/2021/01/08130648/GM_Brandmark_2021_Gradient.jpg",
    "https://brandmark.io/logo-rank/random/pepsi.png",
    "https://logos-world.net/wp-content/uploads/2020/08/Google-Chrome-Logo.png",
    "https://cdn.shopify.com/shopifycloud/hatchful-web/assets/6fcc76cfd1c59f44d43a485167fb3139.png",
    "https://cdn.motor1.com/images/mgl/GwZbJ/s3/logo-story-volkswagen.jpg",
    "https://img.etimg.com/thumb/msid-59738997,width-640,resizemode-4,imgsize-21421/nike.jpg"
  ];

  const [isEditMode, setEditMode] = useState(false);
  const [images, setImages] = useState(initalImages);
  const [selectedInImages, setSelectedInImages] = useState([]);
  const [selectedOutImages, setSelectedOutImages] = useState([]);
  const [intervals, setIntervals] = useState([]);

  const onEditModeClick = (isViewMode) => {
    setEditMode(!isEditMode)
    if(!isViewMode) {
      intervals.map((interval) => 
        clearInterval(interval)
      )
    } else {
      beginAnimation()
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((image, imageIndex) => imageIndex !== index)
    setImages(newImages)
  }

  const base64encode = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      }
      reader.readAsDataURL(file);
    })
  }

  const onFileUpload = async (e) => {
    if(!e.target.files.length) {
      return alert("No files found")
    }
    const file = e.target.files[0];
    const regex = new RegExp("[^\s]+(.*?)\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$")
    const isValidFile = regex.test(file.name)
    //checks to see if the file type matches the regex
    if(!isValidFile) {
      return alert("Invalid file type")
    }
    const url = await base64encode(file)
    const newImages = images.concat(url);
    setImages(newImages)
  }

  const addButton = (
    <Grid 
      container 
      item xs={3} 
      alignItems="center" 
      justify="center"
    >
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={onFileUpload}
      />
      <label htmlFor="raised-button-file">
        {images.length === 8 || images.length === 4 ? (
          <Button variant="contained" className={classes.addBtn} style={{ marginBottom: 50, marginTop: 20 }} component="span">
            <AddIcon fontSize="large" style={{ color: "white" }}/>
          </Button>
        ) : (
          <Button variant="contained" className={classes.addBtn} component="span">
            <AddIcon fontSize="large" style={{ color: "white" }}/>
          </Button>
        )}       
      </label>
    </Grid> 
  )

  const removeButton = (index) => {
    return (
      <IconButton aria-label="remove" className={classes.removeBtn} onClick={() => {removeImage(index)}}>
        <RemoveIcon fontSize="small"/>
      </IconButton>
    )}

  const selectUniqueImage = (uniqueImages = []) => {
    const selectedUniqueImages = [];
    for (let i = 0; i < 3; i++) {    
      let selected = false
      //while there is none selected, select 3 random images from the array
      while (!selected) {
        const randomNum = Math.floor(Math.random() * images.length)
        if (!selectedUniqueImages.includes(randomNum) && !uniqueImages.includes(randomNum)) {
          selectedUniqueImages.push(randomNum)
          selected = true
        }
      }
    }
    return selectedUniqueImages
  }

  const slide = (a) => {
    const shuffledArray = [...a]
    //choose between 1 or 0 to either pop or shift the 3 images
    const coinToss = Math.round(Math.random())
    if (coinToss) {
      const item = shuffledArray.pop()
      shuffledArray.unshift(item)
    } else {
      const item = shuffledArray.shift()
      shuffledArray.push(item)
    }
    return shuffledArray;
  }

  const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const beginAnimation = () => {
    let uniqueImagesInLocal = [];
    let uniqueImagesOutLocal = [];
    let imagesLocal = images;

    async function fading() {
      //takes 3 unique indexes from images
      const uniqueImageIndexes = selectUniqueImage(uniqueImagesInLocal)
      //set the unique images to be fading out
      setSelectedOutImages(uniqueImageIndexes)
      uniqueImagesOutLocal = uniqueImageIndexes
      //maps the new unique images indexes to the images array
      const selectedImageUrls = uniqueImageIndexes.map(imageIndex => imagesLocal[imageIndex])
      //shuffle the selected images around so they dont come back in same position
      const shuffledImages = slide(selectedImageUrls)
      //create a deep clone of images array
      const tempImages = [...imagesLocal]
      //the new shuffled image will then be in place of the current index of the exisiting array
      uniqueImageIndexes.forEach((currUniqueIndex, loopIndex) => {
        tempImages[currUniqueIndex] = shuffledImages[loopIndex]
      })
      //wait 3 seconds
      await delay(3000);
      //set the new array in place of old array
      setImages(tempImages)
      imagesLocal = tempImages
      //the images fading in are the ones fading out in new position
      setSelectedInImages(uniqueImagesOutLocal)
      uniqueImagesInLocal = uniqueImagesOutLocal
      //empty out the fading out images
      setSelectedOutImages([])
      uniqueImagesOutLocal = []
    }

    async function beginAnimationHelper() {
      fading();
      const interval1 = setInterval(() => { fading() }, 6000);
      setIntervals([interval1])
    }
    beginAnimationHelper()
  }

  useEffect(() => {
    beginAnimation()
  }, [])

  const listImages = images.map((image, index) => 
    <Grid 
      container 
      item xs={3} 
      className={classes.imgContainer} 
      alignItems="center" 
      justify="center"
    >
      {isEditMode ? removeButton(index) : null}
      <img src={image} className={clsx(classes.img, {
          [classes.hidden]: selectedOutImages.includes(index)
        })}
      />
    </Grid>
  ) 

  return (
    <Container className={classes.root}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.myLogo}>
            myLOGO
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid 
          container 
          direction="row" 
          justify="space-between" 
          alignItems="flex-end" 
          item xs={12}
          style={{ paddingBottom: 20 }}
        >           
          {!isEditMode ? (
            <Typography variant="h4" className={classes.myLogo}>
              myGallery
            </Typography>
          ) : (
            <Typography variant="h4" className={classes.myLogo}>
              edit Gallery
            </Typography>
          )}
          {!isEditMode ? (
            <Button variant="contained" color="primary" onClick={() => onEditModeClick(false)}>
              Edit Gallery
            </Button>  
          ) : (
            <Button variant="contained" color="primary" onClick={() => onEditModeClick(true)}>
              View Gallery
            </Button>
          )}
        </Grid>
        <Paper>
          <Grid
            container
            alignItems="center"
          >          
            {listImages}
            {isEditMode && images.length < 12 ? addButton : null}
          </Grid>       
        </Paper>
      </Grid> 
    </Container>    
  );
}

export default App;
