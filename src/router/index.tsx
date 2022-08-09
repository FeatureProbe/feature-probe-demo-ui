import { BrowserRouter, Switch, Route } from 'react-router-dom';
import BasicLayout from '../layout/BasicLayout';
import { blankRoutes } from './routes';

const Router = () => {
  return (
    <BrowserRouter>
      <BasicLayout>
        <Switch>
          {
            blankRoutes.map(route => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  exact={route.exact}
                  render={() => (
                    <Route key={route.path} exact path={route.path} component={route.component} />
                  )}
                />
              );
            })
          }
        </Switch>
      </BasicLayout>
    </BrowserRouter>
  );
};

export default Router;
