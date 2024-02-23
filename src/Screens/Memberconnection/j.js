// ...

const Memberconnection = ({ navigation, route }) => {
    // ...
    const [filter, setFilter] = useState(1); // Initial filter value set to 1
  
    // ...
  
    const getyoutubelist = () => {
      let url = `getCoupleData?filter=${filter}&couple_id=1`;
      // ...
    };
  
    // ...
  
    return (
      <View style={{ ...StylesGloble.container, paddingHorizontal: 10 }}>
        {/* ... */}
        <TouchableOpacity
          onPress={() => setFilter((prevFilter) => (prevFilter === 1 ? 0 : 1))}
          style={{ ...StylesGloble.endposition, marginLeft: 30 }}
        >
          <Image style={{ width: 18, height: 18 }} source={imagePath.openfilter} />
        </TouchableOpacity>
        {/* ... */}
        <ScrollView style={{ marginBottom: 30 }} showsVerticalScrollIndicator={false}>
          {youtubeurl &&
            youtubeurl.map((item, index) => {
              return (
                // Check if the filter condition matches the video item
                // If filter is 1, only show "My videos"
                // If filter is 0, show "My videos" and "Others videos"
                (filter === 1 || filter === 0) && (
                  <Pressable key={index} onPress={() => openurlplease(item)} style={{ ...StylesGloble.oneline, marginBottom: 15 }}>
                    <View
                      style={{
                        backgroundColor: 'black',
                        height: 160,
                        width: '100%',
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <ImageBackground style={{ height: 40, width: 40 }} source={imagePath.youtube}></ImageBackground>
                    </View>
                  </Pressable>
                )
              );
            })}
        </ScrollView>
        {/* ... */}
      </View>
    );
  };
  
  export default Memberconnection;
  