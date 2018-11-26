npm:
	npm install --save react-navigation
	npm install leancloud-storage --save
	npm install leancloud-realtime --save
	npm install react-native-vector-icons
	react-native link react-native-vector-icons
	yarn add happypancake/react-native-scrollable-tab-view#master
	npm install --save redux react-redux
	yarn add redux react-redux
	npm install --save prop-types
	npm install --save react-native-navigation-actions
	npm install native-base --save
	react-native link

clean:
	npm uninstall react-navigation
	npm uninstall leancloud-storage
	npm uninstall leancloud-realtime
	npm uninstall react-native-vector-icons
	yarn remove happypancake/react-native-scrollable-tab-view#master
	npm uninstall redux react-redux
	yarn remove redux react-redux
	npm uninstall prop-types
	npm uninstall react-native-navigation-actions
	npm uninstall native-base