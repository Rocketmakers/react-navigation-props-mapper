import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

export const withMappedNavigationProps = SecondOrderWrapperComponent => WrappedComponent => {
  class TargetComponent extends Component {
    render() {
      {
        const { navigation: { state: { params } } } = this.props;
        const { screenProps, ...propsExceptScreenProps } = this.props;
    
        if (!SecondOrderWrapperComponent) {
          return <WrappedComponent {...screenProps} {...propsExceptScreenProps} {...params} ref="comp" />;
        } else {
          return (
            <SecondOrderWrapperComponent
              WrappedComponent={WrappedComponent}
              {...screenProps}
              {...propsExceptScreenProps}
              {...params}
              ref="comp"
            />
          );
        }
      };
    }

    getCompositionComponent() {
      return this.refs["comp"];
    }
  }

  TargetComponent.displayName = `withMappedNavigationProps(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return hoistNonReactStatic(TargetComponent, WrappedComponent);
};

export const withMappedNavigationAndConfigProps = SecondOrderWrapperComponent => WrappedComponent => {
  const TargetWithHoistedStatics = withMappedNavigationProps(SecondOrderWrapperComponent)(
    WrappedComponent
  );

  if (typeof WrappedComponent.navigationOptions === 'function') {
    TargetWithHoistedStatics.navigationOptions = navigationProps =>
      mapScreenConfigProps(navigationProps, WrappedComponent.navigationOptions);
  }

  return TargetWithHoistedStatics;
};

export function mapScreenConfigProps(reactNavigationProps, navigationOptionsFunction) {
  const { navigation, screenProps, navigationOptions } = reactNavigationProps;
  const props = { ...screenProps, ...navigation.state.params, navigationOptions, navigation };
  return navigationOptionsFunction(props);
}
