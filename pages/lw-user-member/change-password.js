import React from 'react'
import { Text, View, Image, StyleSheet, TextInput, Dimensions, TouchableOpacity, Keyboard } from 'react-native'
import { ImageProcessView } from '../../component/list-process-view'
import { NavigationActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { TopModal } from '../../component/top-modal'
import { checkSession, login, changePassword, logout } from '../../modules/user-member-api'
import { UIButton } from '../../component/uibutton'

const globalColor = '#fa7296';
const styles = StyleSheet.create({
    vcode: {
        height: 52,
        width:280,
        justifyContent: 'center',
        alignItems: 'center'
    },
    memberView: {
        height: Dimensions.get('window').height,
        backgroundColor: '#F5F5F5'
    },
    memberTitleImg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width / 600 * 272
    },
    userInputView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 50,
        width: Dimensions.get('window').width,
        marginTop: 2,
        backgroundColor: '#FFF',
        paddingLeft: 10
    },
    splitLine: {
        marginLeft: 5,
        marginRight: 5,
        width: 1,
        height: 30,
        backgroundColor: globalColor
    },
    userInputText: {
        width: Dimensions.get('window').width - 50,
        height: 20,
        fontSize: 20,
    },
    toolView: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        paddingLeft: Dimensions.get('window').width * 0.05,
        paddingRight: Dimensions.get('window').width * 0.05,
    },
    regButton: {
        backgroundColor: globalColor,
    },
    regButtonText: {
        color: '#FFF',
        fontSize: 24
    },
});

/**
 * 修改密码
 */
class UIChangePassword extends React.Component {
    constructor(props) {
        super(props);
        //props:
        //checkingSession
        //onOldPasswordInput
        //onNewPasswordInput1
        //onNewPasswordInput2
        //onChangeButtonPress
    }

    render() {
        return (
            <View style={this.props.style}>
                <View style={styles.userInputView}>
                    <Icon name={'lock'} size={24} color={globalColor} />
                    <View style={styles.splitLine}></View>
                    <TextInput 
                    style={styles.userInputText}
                    autoCapitalize={'none'}
                    clearButtonMode={'always'}
                    keyboardType={'email-address'}
                    placeholder={'旧密码'}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    autoComplete={'username'}
                    editable={!this.props.checkingSession}
                    enablesReturnKeyAutomatically={false}
                    secureTextEntry={true}
                    onSubmitEditing={() => {this.newPasswordInput1.focus(); }}
                    onChangeText={this.props.onOldPasswordInput} />
                </View>
                <View style={styles.userInputView}>
                    <Icon name={'lock'} size={24} color={globalColor} />
                    <View style={styles.splitLine}></View>
                    <TextInput 
                    ref={(input) => { this.newPasswordInput1 = input; }}
                    style={styles.userInputText}
                    autoCapitalize={'none'}
                    clearButtonMode={'always'}
                    keyboardType={'email-address'}
                    placeholder={'新密码'}
                    returnKeyType={'next'}
                    blurOnSubmit={false}
                    autoComplete={'username'}
                    editable={!this.props.checkingSession}
                    enablesReturnKeyAutomatically={false}
                    secureTextEntry={true}
                    onSubmitEditing={() => {this.newPasswordInput2.focus(); }}
                    onChangeText={this.props.onNewPasswordInput1} />
                </View>
                <View style={styles.userInputView}>
                    <Icon name={'lock'} size={24} color={globalColor} />
                    <View style={styles.splitLine}></View>
                    <TextInput 
                    ref={(input) => { this.newPasswordInput2 = input; }}
                    style={styles.userInputText}
                    autoCapitalize={'none'}
                    clearButtonMode={'always'}
                    keyboardType={'email-address'}
                    placeholder={'再输一次'}
                    returnKeyType={'done'}
                    blurOnSubmit={false}
                    autoComplete={'username'}
                    editable={!this.props.checkingSession}
                    enablesReturnKeyAutomatically={false}
                    secureTextEntry={true}
                    onSubmitEditing={this.props.onChangeButtonPress}
                    onChangeText={this.props.onNewPasswordInput2} />
                </View>
                <View style={styles.toolView}>
                    <UIButton text={'修改密码'}
                        style={styles.regButton}
                        textStyle={styles.regButtonText}
                        showLoading={this.props.checkingSession}
                        onPress={this.props.onChangeButtonPress}/>
                </View>
            </View>
        );
    }
}

class UserMemberChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalComp: null,
            showModal: false,
            checkingSession: true,
            sessionState: false,
            errmsgModal: false,
            errmsg: '',
            errtitle: '错误'
        }
    }
    inputOldPassword = ''
    inputNewPassword1 = ''
    inputNewPassword2 = ''
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'A岛-修改密码'
        }
    }
    
    componentDidMount = async () => {
        let sessionInfo = await checkSession();
        if(sessionInfo.status != 'ok') {
            this.setState({
                errtitle: '错误',
                errmsgModal: true,
                errmsg: `检查状态失败：${sessionInfo.errmsg}。`,
                checkingSession: false
            });
        }
        else {
            this.setState({
                sessionState: sessionInfo.session,
                checkingSession: false
            });
        }
    }

    /**
     * 开始改密码
     */
    _onChangeStart = async () => {
        Keyboard.dismiss();
        if( this.inputOldPassword.length < 5) {
            this.setState({
                errtitle: '错误',
                errmsgModal: true,
                errmsg: '旧密码长度太短',
            });
            return;
        }
        if(this.inputNewPassword1 !== this.inputNewPassword2) {
            this.setState({
                errtitle: '错误',
                errmsgModal: true,
                errmsg: '新密码输入不相同',
            });
            return;
        }
        if(this.inputNewPassword1.length < 5) {
            this.setState({
                errtitle: '错误',
                errmsgModal: true,
                errmsg: '新密码长度太短',
            });
            return; 
        }
        this.setState({checkSession: true}, async ()=>{
            let info = await changePassword(this.inputOldPassword,this.inputNewPassword1,this.inputNewPassword2);
            if(info.status == 'ok') {
                await logout();
                this.props.navigation.reset([
                    NavigationActions.navigate({
                        routeName: 'UserMemberLogin'
                    })
                ], 0);
            }
            else {
                this.setState({
                    errtitle: '错误',
                    errmsgModal: true,
                    errmsg: info.errmsg,
                    checkSession: false
                });
            }
        });
    }

   
    render() {
        return (
            <View style={styles.memberView}>
               <TopModal
                    show={this.state.errmsgModal}
                    width={280}
                    title={this.state.errtitle}
                    rightButtonText={'确认'}
                    item={
                        <View style={{width: 260,  margin: 10}}>
                            <Text style={{fontSize: 20}}>{this.state.errmsg}</Text>
                        </View>
                    }
                    onClosePress={()=>{
                        this.setState({
                            errmsgModal: false
                        });
                    }}
                    onRightButtonPress={()=>{
                        this.setState({
                            errmsgModal: false
                        });
                    }} />
                <Image 
                style={styles.memberTitleImg} 
                resizeMode={'contain'} 
                source={require('../../imgs/member-title.png')} />
                <UIChangePassword
                    checkingSession={this.state.checkingSession}
                    onOldPasswordInput={(text) => {this.inputOldPassword = text}}
                    onNewPasswordInput1={(text) => {this.inputNewPassword1 = text}}
                    onNewPasswordInput2={(text) => {this.inputNewPassword2 = text}}
                    onChangeButtonPress={this._onChangeStart}
                />
            </View>
        )
    }
}

export { UserMemberChangePassword };