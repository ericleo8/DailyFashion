import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Icon, CheckBox} from 'react-native-elements';
import React, {useState, useEffect, useRef} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {InputComponent} from '../components/InputComponent';
import SelectDropdown from 'react-native-select-dropdown';
import {categoryList} from '../../data/Data';
import realm from '../../store/realm';
import {Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen-hooks';
const EditProductScreen = props => {
  const {route} = props;
  const {navigation} = props;
  const idProduct = route.params.idProduct;
  const [productData, setProductData] = useState({
    productName: '',
    imagePath: '',
    category: null,
    description: '',
    price: null,
    instagram: '',
    facebook: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const data = realm.objects('Product').filtered(`id = ${idProduct}`)[0];
    setProductData({
      productName: data.productName,
      imagePath: data.imagePath,
      category: data.category,
      description: data.description,
      price: String(data.price),
      instagram: data.instagram,
      facebook: data.facebook,
      phoneNumber: data.phoneNumber,
    });
  }, [idProduct]);
  const onInputChange = (type, value) => {
    setProductData({
      ...productData,
      [type]: value,
    });
  };
  const addImage = () => {
    ImagePicker.openPicker({
      width: 2000,
      height: 2000,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setProductData({
          ...productData,
          imagePath: image.path,
        });
      })
      .catch(errorMessage => {
        console.log(errorMessage);
      });
  };
  const saveData = () => {
    if (
      productData.productName === '' ||
      productData.imagePath === '' ||
      productData.description === '' ||
      productData.category === ''
    ) {
      alert('Please fill all your product information!');
    } else if (
      productData.phoneNumber === '' &&
      productData.instagram === '' &&
      productData.facebook === ''
    ) {
      alert('Please fill at least one seller contact!');
    } else {
      const updatedData = realm
        .objects('Product')
        .filtered(`id = ${idProduct}`)[0];

      if (
        updatedData.productName === productData.productName &&
        updatedData.imagePath === productData.imagePath &&
        updatedData.category === productData.category &&
        updatedData.description === productData.description &&
        updatedData.price === parseInt(productData.price) &&
        updatedData.instagram === productData.instagram &&
        updatedData.facebook === productData.facebook &&
        updatedData.phoneNumber === productData.phoneNumber
      ) {
        alert('Nothing to change!');
      } else {
        realm.write(() => {
          updatedData.productName = productData.productName;
          updatedData.imagePath = productData.imagePath;
          updatedData.category = productData.category;
          updatedData.description = productData.description;
          updatedData.price = parseInt(productData.price);
          updatedData.instagram = productData.instagram;
          updatedData.facebook = productData.facebook;
          updatedData.phoneNumber = productData.phoneNumber;
        });
        Alert.alert(
          'Success',
          'Successfully update your product information!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    }
  };
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={() => addImage()}>
            <Image
              style={{
                width: productData.imagePath !== '' ? wp('50%') : 50,
                height: productData.imagePath !== '' ? wp('50%') : 50,
              }}
              source={{
                uri:
                  productData.imagePath !== ''
                    ? productData.imagePath
                    : 'https://assets.webiconspng.com/uploads/2017/02/Photograph-Icon-PNG.png',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalContainer}>
          <InputComponent
            placeholder="Product Name"
            value={productData.productName}
            onChangeText={text => onInputChange('productName', text)}
            color="black"
          />
          <SelectDropdown
            data={categoryList}
            defaultButtonText="Select category"
            defaultValueByIndex={productData.category - 1}
            onSelect={item => {
              onInputChange('category', item.id);
            }}
            buttonTextAfterSelection={item => {
              return item.name;
            }}
            rowTextForSelection={item => {
              return item.name;
            }}
            buttonStyle={styles.selectDropdown}
            buttonTextStyle={styles.selectText}
            // ref={dropdownRef}
          />
        </View>
        <View style={styles.horizontalContainer}>
          <InputComponent
            placeholder="Description"
            value={productData.description}
            onChangeText={text => onInputChange('description', text)}
            isDescription={true}
            color="black"
          />
          <InputComponent
            placeholder="Price"
            value={productData.price}
            keyboardType="phone-pad"
            onChangeText={text => onInputChange('price', text)}
            isIcon={true}
            name="dollar"
            type="font-awesome"
            color="black"
          />
        </View>
        <Text style={styles.sellerText}>Seller Contact</Text>
        <InputComponent
          placeholder="Whatsapp number (ex : +4498739230)"
          value={productData.phoneNumber}
          onChangeText={text => onInputChange('phoneNumber', text)}
          isIcon={true}
          name="whatsapp"
          type="font-awesome"
          color="black"
        />
        <InputComponent
          placeholder="Instagram (ex: @timedooracademy)"
          value={productData.instagram}
          onChangeText={text => onInputChange('instagram', text)}
          isIcon={true}
          name="instagram"
          type="font-awesome"
          color="black"
        />
        <InputComponent
          placeholder="Facebook (ex : Timedoor)"
          value={productData.facebook}
          onChangeText={text => onInputChange('facebook', text)}
          isIcon={true}
          name="facebook-square"
          type="font-awesome"
          color="black"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => saveData()}>
            <Text style={styles.saveText}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    margin: 8,
    paddingBottom: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  imageButton: {
    width: wp('50%'),
    height: wp('50%'),
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sellerText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 0,
    color: 'black',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'mistyrose',
  },
  saveText: {
    color: 'black',
  },
  selectDropdown: {
    borderRadius: 10,
    backgroundColor: 'skyblue',
    width: wp('40%'),
    height: hp('4%'),
    marginLeft: 8,
  },
  selectText: {
    fontSize: hp('1.5%'),
  },
});
