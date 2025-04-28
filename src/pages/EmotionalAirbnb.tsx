
  // Update handleSubmit to include correct user_id and ensure proper folder structure
  const handleSubmit = async () => {
    if (!user) {
      toast.error("Not logged in", {
        description: "You must be logged in to save your emotional airbnb.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload drawings if they exist
      let emotionDrawingPath = null;
      let locationDrawingPath = null;
      let appearanceDrawingPath = null;
      let intensityDrawingPath = null;
      let soundDrawingPath = null;
      let messageDrawingPath = null;

      // Helper function for uploading drawings with proper folder structure
      const uploadDrawing = async (blob: Blob | null, section: string) => {
        if (!blob || !user) return null;
        
        // Create a structured filename with userId, section type, and timestamp
        const fileName = `${user.id}/${section}_${Date.now()}.png`;
        console.log(`Uploading file to path: ${fileName}`);
        
        const { data, error: uploadError } = await supabase.storage
          .from('emotional_airbnb_drawings')
          .upload(fileName, blob, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (uploadError) {
          console.error(`Error uploading ${section} drawing:`, uploadError);
          throw new Error(`Failed to upload ${section} drawing: ${uploadError.message}`);
        }
        
        // Return just the path for storage in the database
        return fileName;
      };

      // Upload each drawing if it exists - making sure to use the correct folder structure
      if (formData.emotionDrawing) {
        emotionDrawingPath = await uploadDrawing(formData.emotionDrawing, 'emotion');
      }
      
      if (formData.locationDrawing) {
        locationDrawingPath = await uploadDrawing(formData.locationDrawing, 'location');
      }
      
      if (formData.appearanceDrawing) {
        appearanceDrawingPath = await uploadDrawing(formData.appearanceDrawing, 'appearance');
      }
      
      if (formData.intensityDrawing) {
        intensityDrawingPath = await uploadDrawing(formData.intensityDrawing, 'intensity');
      }
      
      if (formData.soundDrawing) {
        soundDrawingPath = await uploadDrawing(formData.soundDrawing, 'sound');
      }
      
      if (formData.messageDrawing) {
        messageDrawingPath = await uploadDrawing(formData.messageDrawing, 'message');
      }
      
      console.log(isVisible)
      // Insert data into the database
      const { error } = await supabase
        .from('emotional_airbnb')
        .insert({
          user_id: user.id,
          emotion_text: formData.emotionText || null,
          location_in_body_text: formData.locationText || null,
          appearance_description_text: formData.appearanceText || null,
          intensity_description_text: formData.intensityText || null,
          sound_text: formData.soundText || null,
          message_description_text: formData.messageText || null,
          emotion_drawing_path: emotionDrawingPath,
          location_in_body_drawing_path: locationDrawingPath,
          appearance_drawing_path: appearanceDrawingPath,
          intensity_drawing_path: intensityDrawingPath,
          sound_drawing_path: soundDrawingPath,
          message_drawing_path: messageDrawingPath,
          visibility: isVisible
        });

      if (error) {
        throw error;
      }

      // Show celebration instead of navigating immediately
      
    } catch (error: any) {
      console.error('Error saving emotional airbnb:', error);
      toast.error("Error saving", {
        description: error.message || "There was a problem saving your emotional airbnb entry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
