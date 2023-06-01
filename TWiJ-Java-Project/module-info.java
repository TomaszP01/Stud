module mediaplayer.mediaplayer {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;
    requires javafx.media;
            
        requires org.controlsfx.controls;
                            
    opens mediaplayer.mediaplayer to javafx.fxml;
    exports mediaplayer.mediaplayer;
}