import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PreviewComponent } from './preview/preview.component';
import { EditorComponent } from './editor/editor.component';

export const routes: Routes = [
    {path: 'editor', title:'Editor', component: EditorComponent},
    {path: 'article/preview', component: PreviewComponent},
    {path: '', redirectTo:'editor', pathMatch:'full'}
];
